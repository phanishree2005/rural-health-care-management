package com.ruralhealthcare.repository;

import com.ruralhealthcare.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Map;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    List<Patient> findByNameContainingIgnoreCase(String name);
    List<Patient> findByVillageContainingIgnoreCase(String village);
    List<Patient> findByDiseaseContainingIgnoreCase(String disease);

    @Query("SELECT p.village as village, COUNT(p) as count FROM Patient p GROUP BY p.village")
    List<Object[]> getVillageStatistics();

    @Query("SELECT p.disease as disease, COUNT(p) as count FROM Patient p GROUP BY p.disease")
    List<Object[]> getDiseaseStatistics();

    @Query("SELECT SUM(p.totalCost) FROM Patient p")
    Double getTotalRevenue();
}
