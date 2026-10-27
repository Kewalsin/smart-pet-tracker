import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useAppStore } from '../../store';
import { useTheme } from '../../hooks/useTheme';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { AppScrollView } from '../../components/layout/AppScrollView';
import { AppHeader } from '../../components/common/AppHeader';
import { AppCard } from '../../components/common/AppCard';
import { AppText } from '../../components/common/AppText';
import { AppButton } from '../../components/common/AppButton';
import { AppInput } from '../../components/common/AppInput';
import { AppIcon } from '../../components/common/AppIcon';
import { PetSelector } from '../../components/pet/PetSelector';
import { HealthRecordCard } from '../../components/health/HealthRecordCard';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { HealthRecord, HealthRecordType } from '../../types';
import { validateHealthRecordForm } from '../../utils/validation';
import { getIsoDateToday } from '../../utils/dateUtils';

const HEALTH_CATEGORIES: { label: string; value: HealthRecordType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Weight', value: 'weight' },
  { label: 'Vaccines', value: 'vaccination' },
  { label: 'Medications', value: 'medication' },
  { label: 'Vet Visits', value: 'vet_visit' },
  { label: 'Observations', value: 'observation' },
];

export const HealthScreen: React.FC = () => {
  const { theme } = useTheme();

  const pets = useAppStore((state) => state.pets);
  const selectedPetId = useAppStore((state) => state.selectedPetId);
  const healthRecords = useAppStore((state) => state.healthRecords);
  const addHealthRecord = useAppStore((state) => state.addHealthRecord);
  const updateHealthRecord = useAppStore((state) => state.updateHealthRecord);
  const deleteHealthRecord = useAppStore((state) => state.deleteHealthRecord);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const [filterType, setFilterType] = useState<HealthRecordType | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [formType, setFormType] = useState<HealthRecordType>('weight');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(getIsoDateToday());
  const [formWeight, setFormWeight] = useState('');
  const [formVaccine, setFormVaccine] = useState('');
  const [formNextDue, setFormNextDue] = useState('');
  const [formClinic, setFormClinic] = useState('');
  const [formMedication, setFormMedication] = useState('');
  const [formDosage, setFormDosage] = useState('');
  const [formVetName, setFormVetName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Filter records for selected pet & category
  const filteredRecords = healthRecords
    .filter((r) => r.petId === activePet?.id)
    .filter((r) => (filterType === 'all' ? true : r.type === filterType));

  const openAddModal = () => {
    setEditingRecord(null);
    setFormType('weight');
    setFormTitle('');
    setFormDate(getIsoDateToday());
    setFormWeight(activePet?.weight ? activePet.weight.toString() : '15');
    setFormVaccine('');
    setFormNextDue('');
    setFormClinic('');
    setFormMedication('');
    setFormDosage('');
    setFormVetName('');
    setFormNotes('');
    setFormErrors({});
    setModalVisible(true);
  };

  const openEditModal = (rec: HealthRecord) => {
    setEditingRecord(rec);
    setFormType(rec.type);
    setFormTitle(rec.title);
    setFormDate(rec.date);
    setFormWeight(rec.weightValue ? rec.weightValue.toString() : '');
    setFormVaccine(rec.vaccineName || '');
    setFormNextDue(rec.nextDueDate || '');
    setFormClinic(rec.clinicName || '');
    setFormMedication(rec.medicationName || '');
    setFormDosage(rec.dosage || '');
    setFormVetName(rec.vetName || '');
    setFormNotes(rec.notes || '');
    setFormErrors({});
    setModalVisible(true);
  };

  const handleSave = async () => {
    const data: Partial<HealthRecord> = {
      petId: activePet.id,
      type: formType,
      title: formTitle,
      date: formDate,
      notes: formNotes || undefined,
      weightValue: formType === 'weight' ? parseFloat(formWeight) || undefined : undefined,
      vaccineName: formType === 'vaccination' ? formVaccine : undefined,
      nextDueDate: formType === 'vaccination' ? formNextDue : undefined,
      clinicName: formClinic || undefined,
      medicationName: formType === 'medication' ? formMedication : undefined,
      dosage: formType === 'medication' ? formDosage : undefined,
      vetName: formType === 'vet_visit' ? formVetName : undefined,
    };

    const validation = validateHealthRecordForm(data);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    setSaving(true);
    try {
      if (editingRecord) {
        await updateHealthRecord(editingRecord.id, data);
      } else {
        await addHealthRecord(data as any);
      }
      setModalVisible(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteTargetId) {
      await deleteHealthRecord(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <ScreenContainer>
      <AppHeader
        title="Health Records"
        subtitle={activePet ? `${activePet.name}'s medical history` : undefined}
        showBackButton
        rightElement={
          <AppButton
            title="Add Log"
            onPress={openAddModal}
            variant="primary"
            size="sm"
            leftIcon="add"
          />
        }
        style={styles.header}
      />

      <AppScrollView contentContainerStyle={styles.content}>
        {/* Pet Switcher */}
        <PetSelector />

        {/* Filter Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {HEALTH_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              onPress={() => setFilterType(cat.value)}
              style={[
                styles.chip,
                {
                  backgroundColor:
                    filterType === cat.value
                      ? theme.colors.primaryUltraLight
                      : theme.colors.card,
                  borderColor:
                    filterType === cat.value
                      ? theme.colors.primary
                      : theme.colors.border,
                },
              ]}
            >
              <AppText
                variant="captionBold"
                color={filterType === cat.value ? 'brand' : 'secondary'}
              >
                {cat.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Records List */}
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <HealthRecordCard
              key={record.id}
              record={record}
              onEdit={() => openEditModal(record)}
              onDelete={() => setDeleteTargetId(record.id)}
            />
          ))
        ) : (
          <EmptyState
            icon="medkit-outline"
            title="No Records Found"
            description="Add health events like vaccinations, weight entries, and doctor visits."
            actionTitle="Log Health Record"
            onActionPress={openAddModal}
          />
        )}
      </AppScrollView>

      {/* Add / Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <AppHeader
              title={editingRecord ? 'Edit Health Log' : 'New Health Log'}
              rightElement={
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                  <AppIcon name="close" size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
              }
            />

            <ScrollView contentContainerStyle={styles.modalScroll}>
              {/* Type Selector */}
              <AppText variant="captionBold" color="secondary" style={styles.modalLabel}>
                Category
              </AppText>
              <View style={styles.typeSelectorRow}>
                {(['weight', 'vaccination', 'medication', 'vet_visit', 'observation'] as HealthRecordType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setFormType(t)}
                    style={[
                      styles.typeBtn,
                      {
                        backgroundColor: formType === t ? theme.colors.primaryUltraLight : theme.colors.card,
                        borderColor: formType === t ? theme.colors.primary : theme.colors.border,
                      },
                    ]}
                  >
                    <AppText
                      variant="captionBold"
                      color={formType === t ? 'brand' : 'secondary'}
                    >
                      {t.replace('_', ' ').toUpperCase()}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>

              <AppInput
                label="Title / Summary *"
                placeholder="e.g. Monthly Weigh-In or Rabies Booster"
                value={formTitle}
                onChangeText={setFormTitle}
                error={formErrors.title}
              />

              <AppInput
                label="Date (YYYY-MM-DD) *"
                placeholder="YYYY-MM-DD"
                value={formDate}
                onChangeText={setFormDate}
                error={formErrors.date}
              />

              {formType === 'weight' && (
                <AppInput
                  label="Weight (kg) *"
                  placeholder="e.g. 28.5"
                  value={formWeight}
                  onChangeText={setFormWeight}
                  keyboardType="numeric"
                  error={formErrors.weightValue}
                />
              )}

              {formType === 'vaccination' && (
                <>
                  <AppInput
                    label="Vaccine Name *"
                    placeholder="e.g. Defensor 3 (Rabies)"
                    value={formVaccine}
                    onChangeText={setFormVaccine}
                    error={formErrors.vaccineName}
                  />
                  <AppInput
                    label="Next Due Date"
                    placeholder="YYYY-MM-DD"
                    value={formNextDue}
                    onChangeText={setFormNextDue}
                  />
                  <AppInput
                    label="Veterinary Clinic"
                    placeholder="e.g. Oakwood Animal Hospital"
                    value={formClinic}
                    onChangeText={setFormClinic}
                  />
                </>
              )}

              {formType === 'medication' && (
                <>
                  <AppInput
                    label="Medication Name *"
                    placeholder="e.g. Heartgard Plus"
                    value={formMedication}
                    onChangeText={setFormMedication}
                    error={formErrors.medicationName}
                  />
                  <AppInput
                    label="Dosage Instructions *"
                    placeholder="e.g. 1 chewable tablet monthly"
                    value={formDosage}
                    onChangeText={setFormDosage}
                    error={formErrors.dosage}
                  />
                </>
              )}

              {formType === 'vet_visit' && (
                <>
                  <AppInput
                    label="Doctor / Vet Name"
                    placeholder="e.g. Dr. Sarah Mitchell"
                    value={formVetName}
                    onChangeText={setFormVetName}
                  />
                  <AppInput
                    label="Clinic / Hospital"
                    placeholder="e.g. Oakwood Animal Hospital"
                    value={formClinic}
                    onChangeText={setFormClinic}
                  />
                </>
              )}

              <AppInput
                label="Notes / Doctor Advice"
                placeholder="Any observations, instructions, or follow-up notes"
                value={formNotes}
                onChangeText={setFormNotes}
                multiline
                numberOfLines={3}
              />

              <AppButton
                title={editingRecord ? 'Save Changes' : 'Create Record'}
                onPress={handleSave}
                loading={saving}
                variant="primary"
                size="lg"
                style={styles.modalSubmitBtn}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        visible={!!deleteTargetId}
        title="Delete Health Record?"
        message="Are you sure you want to remove this health record? This action cannot be undone."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  chipRow: {
    gap: 8,
    paddingVertical: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  closeBtn: {
    padding: 6,
  },
  modalScroll: {
    paddingBottom: 24,
  },
  modalLabel: {
    marginBottom: 8,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalSubmitBtn: {
    marginTop: 16,
  },
});
