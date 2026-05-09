package com.ruralhealthcare.service;

import com.ruralhealthcare.entity.Patient;
import com.ruralhealthcare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient savePatient(Patient patient) {
        // Generate Patient ID if new
        if (patient.getId() == null) {
            long count = patientRepository.count() + 1;
            patient.setPatientId("PAT-" + String.format("%03d", count));
        }
        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }

    public List<Patient> searchPatients(String query) {
        List<Patient> byName = patientRepository.findByNameContainingIgnoreCase(query);
        if (!byName.isEmpty()) return byName;
        
        List<Patient> byVillage = patientRepository.findByVillageContainingIgnoreCase(query);
        if (!byVillage.isEmpty()) return byVillage;

        return patientRepository.findByDiseaseContainingIgnoreCase(query);
    }
}
