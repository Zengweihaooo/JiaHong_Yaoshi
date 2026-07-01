import {
  combinationTherapyGroups,
  medicineDiagnosisEntries
} from "@/data/medicineDiagnosisMap";

function createRuleMatcher(keywords) {
  return (medicineName) => keywords.some((keyword) => medicineName.includes(keyword));
}

export const medicineDiagnosisRules = medicineDiagnosisEntries.map((entry) => ({
  id: entry.id,
  match: createRuleMatcher(entry.keywords),
  options: [...entry.diagnoses],
  disabledOptions: [...(entry.disabledDiagnoses || [])]
}));

export function findMedicineDiagnosisRule(medicineName) {
  const normalized = String(medicineName || "").trim();
  if (!normalized) return null;

  return medicineDiagnosisEntries.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword))) || null;
}

export function findMedicineDiagnosisRuleRecord(medicineName) {
  return findMedicineDiagnosisRule(medicineName);
}

function mapDiagnosisOptions(labels, disabledLabels = [], isDiagnosisDisabled = () => false) {
  return labels.map((label) => ({
    label,
    disabled: disabledLabels.includes(label) || isDiagnosisDisabled(label)
  }));
}

export function getDiseaseOptionsForMedicine(medicineName, isDiagnosisDisabled = () => false) {
  const rule = findMedicineDiagnosisRule(medicineName);
  if (!rule) return [];

  return mapDiagnosisOptions(rule.diagnoses, rule.disabledDiagnoses || [], isDiagnosisDisabled);
}

export function getDiagnosesForMedicine(medicineName) {
  return findMedicineDiagnosisRule(medicineName)?.diagnoses || [];
}

export function getMedicinesForDiagnosis(diagnosis, medicineCatalog = []) {
  const normalized = String(diagnosis || "").trim();
  if (!normalized) return [];

  const matchedRuleIds = medicineDiagnosisEntries
    .filter((entry) => entry.diagnoses.includes(normalized))
    .map((entry) => entry.id);

  if (!matchedRuleIds.length) return [];

  return medicineCatalog.filter((medicine) => {
    const rule = findMedicineDiagnosisRule(medicine.name);
    return rule && matchedRuleIds.includes(rule.id);
  });
}

export function medicineMatchesDiagnosis(medicineName, diagnosis) {
  const rule = findMedicineDiagnosisRule(medicineName);
  return Boolean(rule?.diagnoses.includes(diagnosis));
}

export function isMedicineDiagnosisMatched(medicine, diagnoses) {
  const rule = findMedicineDiagnosisRule(medicine.name);
  if (!rule) return true;
  if (medicine.linkedDiagnosis && rule.diagnoses.includes(medicine.linkedDiagnosis)) {
    return true;
  }
  return rule.diagnoses.some((option) => diagnoses.includes(option));
}

export function listUnmappedMedicines(medicineCatalog = []) {
  return medicineCatalog.filter((medicine) => !findMedicineDiagnosisRule(medicine.name));
}

function medicineMatchesComboKeyword(medicine, keyword) {
  return String(medicine.name || "").includes(keyword);
}

export function findActiveCombinationGroups(unlinkedMedicines = []) {
  return combinationTherapyGroups
    .map((group) => {
      const matchedMedicines = unlinkedMedicines.filter((medicine) =>
        group.keywords.some((keyword) => medicineMatchesComboKeyword(medicine, keyword))
      );
      if (matchedMedicines.length < group.minCount) return null;
      return {
        id: group.id,
        medicines: matchedMedicines,
        medicineIds: matchedMedicines.map((item) => item.id),
        names: matchedMedicines.map((item) => item.name),
        namesJoined: matchedMedicines.map((item) => item.name).join("+"),
        diagnoses: [...group.diagnoses]
      };
    })
    .filter(Boolean);
}

export function canUseCombinationMedicine(medicines = []) {
  return medicines.length >= 2;
}

function getCommonDiagnosisOptions(medicines = [], isDiagnosisDisabled = () => false) {
  if (medicines.length < 2) return [];

  const optionSets = medicines.map((medicine) =>
    getDiseaseOptionsForMedicine(medicine.name, isDiagnosisDisabled).map((option) => option.label)
  );
  const [firstSet, ...restSets] = optionSets;
  if (!firstSet?.length) return [];

  const commonLabels = firstSet.filter((label) => restSets.every((set) => set.includes(label)));
  return mapDiagnosisOptions(commonLabels, [], isDiagnosisDisabled);
}

export function buildCombinationRecommendations(unlinkedMedicines = [], { isDiagnosisDisabled = () => false } = {}) {
  const recommendations = [];
  const presetGroups = findActiveCombinationGroups(unlinkedMedicines);

  presetGroups.forEach((group) => {
    recommendations.push({
      id: group.id,
      type: "preset",
      medicineIds: group.medicineIds,
      namesJoined: group.namesJoined,
      options: mapDiagnosisOptions(group.diagnoses, [], isDiagnosisDisabled)
    });
  });

  const coveredByPreset = new Set(presetGroups.flatMap((group) => group.medicineIds));
  const uncovered = unlinkedMedicines.filter((medicine) => !coveredByPreset.has(medicine.id));
  const genericCandidates =
    uncovered.length >= 2
      ? uncovered
      : presetGroups.length === 0 && unlinkedMedicines.length >= 2
        ? unlinkedMedicines
        : [];

  if (genericCandidates.length >= 2) {
    const options = getCommonDiagnosisOptions(genericCandidates, isDiagnosisDisabled);
    if (options.length) {
      recommendations.push({
        id: `generic-${genericCandidates.map((medicine) => medicine.id).join("-")}`,
        type: "generic",
        medicineIds: genericCandidates.map((medicine) => medicine.id),
        namesJoined: genericCandidates.map((medicine) => medicine.name).join("+"),
        options
      });
    }
  }

  return recommendations;
}

export function buildUnlinkedMedicinePrompts(unlinkedMedicines = [], { isDiagnosisDisabled = () => false } = {}) {
  return unlinkedMedicines
    .map((medicine) => {
      const options = getDiseaseOptionsForMedicine(medicine.name, isDiagnosisDisabled);
      if (!options.length) return null;
      return {
        type: "single",
        id: String(medicine.id),
        medicineIds: [medicine.id],
        name: medicine.name,
        namesJoined: medicine.name,
        options
      };
    })
    .filter(Boolean);
}

export function formatLinkedMedicineNames(names = []) {
  if (!names.length) return "-";
  if (names.length === 1) return names[0];
  return names.join("+");
}
