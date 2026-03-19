'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Rubric } from '@/types';
import styles from './AdminRubrics.module.scss';

interface RubricFormData {
  name: string;
  description: string;
  icon: string;
  color: string;
  image: string;
}

export default function AdminRubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addForm = useForm<RubricFormData>({
    defaultValues: { color: '#1a9e6e', icon: 'GraduationCap' },
  });

  const editForm = useForm<RubricFormData>();

  useEffect(() => {
    fetchRubrics();
  }, []);

  const fetchRubrics = async () => {
    try {
      const res = await fetch('/api/rubrics');
      const data = await res.json();
      setRubrics(data);
    } catch {
      setError('Eroare la încărcarea rubricilor.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: RubricFormData) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/rubrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchRubrics();
        addForm.reset({ color: '#1a9e6e', icon: 'GraduationCap' });
        setShowAddForm(false);
      } else {
        setError('Eroare la adăugarea rubricii.');
      }
    } catch {
      setError('Eroare de rețea.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (rubric: Rubric) => {
    setEditingId(rubric.id);
    editForm.reset({
      name: rubric.name,
      description: rubric.description,
      icon: rubric.icon,
      color: rubric.color,
      image: rubric.image,
    });
  };

  const handleSaveEdit = async (data: RubricFormData) => {
    if (!editingId) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/rubrics/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchRubrics();
        setEditingId(null);
      } else {
        setError('Eroare la salvare.');
      }
    } catch {
      setError('Eroare de rețea.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi rubrica "${name}"?`)) return;
    try {
      await fetch(`/api/rubrics/${id}`, { method: 'DELETE' });
      await fetchRubrics();
    } catch {
      setError('Eroare la ștergere.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Rubrici</h1>
          <p className={styles.pageSubtitle}>{rubrics.length} rubrici definite</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? 'Anulează' : 'Adaugă rubrică'}
        </button>
      </div>

      {error && (
        <div className={styles.errorBanner}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <div className={styles.formCard}>
          <h2 className={styles.formCardTitle}>Adaugă rubrică nouă</h2>
          <form onSubmit={addForm.handleSubmit(handleAdd)} className={styles.form} noValidate>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Nume rubrică *</label>
                <input
                  className={`${styles.input} ${addForm.formState.errors.name ? styles.inputError : ''}`}
                  placeholder="Ex: Excursii Școlare"
                  {...addForm.register('name', { required: 'Numele este obligatoriu' })}
                />
                {addForm.formState.errors.name && (
                  <span className={styles.fieldError}>{addForm.formState.errors.name.message}</span>
                )}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Icoana (Lucide icon name)</label>
                <input
                  className={styles.input}
                  placeholder="Ex: GraduationCap, Heart, Bus"
                  {...addForm.register('icon')}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descriere *</label>
              <textarea
                className={styles.textarea}
                placeholder="Descriere a rubricii..."
                rows={3}
                {...addForm.register('description', { required: 'Descrierea este obligatorie' })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Culoare accent</label>
                <div className={styles.colorRow}>
                  <input
                    type="color"
                    className={styles.colorPicker}
                    {...addForm.register('color')}
                  />
                  <input
                    className={styles.input}
                    placeholder="#1a9e6e"
                    {...addForm.register('color')}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>URL imagine</label>
                <input
                  className={styles.input}
                  placeholder="https://images.unsplash.com/..."
                  {...addForm.register('image')}
                />
              </div>
            </div>

            <div className={styles.formFooter}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowAddForm(false)}
              >
                Anulează
              </button>
              <button type="submit" className={styles.submitBtn} disabled={saving}>
                {saving ? (
                  <>
                    <span className={styles.spinner} />
                    Se salvează...
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Adaugă rubrică
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rubrics list */}
      {loading ? (
        <div className={styles.loadingMsg}>Se încarcă rubricile...</div>
      ) : (
        <div className={styles.rubricsList}>
          {rubrics.map((rubric) => (
            <div key={rubric.id} className={styles.rubricCard}>
              {editingId === rubric.id ? (
                <form
                  onSubmit={editForm.handleSubmit(handleSaveEdit)}
                  className={styles.editForm}
                  noValidate
                >
                  <div className={styles.editFormHeader}>
                    <h3 className={styles.editFormTitle}>Editează: {rubric.name}</h3>
                    <button
                      type="button"
                      className={styles.closeEditBtn}
                      onClick={() => setEditingId(null)}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Nume</label>
                      <input
                        className={styles.input}
                        {...editForm.register('name', { required: true })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Icoana</label>
                      <input className={styles.input} {...editForm.register('icon')} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Descriere</label>
                    <textarea
                      className={styles.textarea}
                      rows={2}
                      {...editForm.register('description')}
                    />
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>Culoare</label>
                      <input className={styles.input} {...editForm.register('color')} />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>URL imagine</label>
                      <input className={styles.input} {...editForm.register('image')} />
                    </div>
                  </div>

                  <div className={styles.formFooter}>
                    <button type="button" className={styles.cancelBtn} onClick={() => setEditingId(null)}>
                      Anulează
                    </button>
                    <button type="submit" className={styles.submitBtn} disabled={saving}>
                      {saving ? (
                        <><span className={styles.spinner} />Se salvează...</>
                      ) : (
                        <><Save size={16} />Salvează</>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.rubricCardContent}>
                  <div
                    className={styles.rubricColorBar}
                    style={{ background: rubric.color }}
                  />
                  <div className={styles.rubricInfo}>
                    <div className={styles.rubricHeader}>
                      <h3 className={styles.rubricName}>{rubric.name}</h3>
                      <span className={styles.rubricIcon}>
                        icon: <code>{rubric.icon}</code>
                      </span>
                    </div>
                    <p className={styles.rubricDesc}>{rubric.description}</p>
                    <div className={styles.rubricMeta}>
                      <span
                        className={styles.rubricColorChip}
                        style={{ background: rubric.color }}
                      >
                        {rubric.color}
                      </span>
                      <span className={styles.rubricSlug}>/{rubric.slug}</span>
                    </div>
                  </div>
                  <div className={styles.rubricActions}>
                    <button
                      className={styles.iconBtn}
                      onClick={() => handleEdit(rubric)}
                      title="Editează"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className={styles.iconBtnDelete}
                      onClick={() => handleDelete(rubric.id, rubric.name)}
                      title="Șterge"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
