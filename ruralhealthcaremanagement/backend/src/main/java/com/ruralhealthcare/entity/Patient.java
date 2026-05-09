package com.ruralhealthcare.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "patients")
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String patientId; // Auto-generated string like PAT-001

    private String name;
    private Integer age;
    private String gender;
    private String disease;
    private String village;
    private String doctorAssigned;
    private LocalDate dateOfVisit;
    private String treatmentDetails;
    private Double medicineCost;
    private Double consultationCost;
    private Double totalCost;
    private String contactNumber;

    public Patient() {}

    public Patient(Long id, String patientId, String name, Integer age, String gender, String disease,
                   String village, String doctorAssigned, LocalDate dateOfVisit, String treatmentDetails,
                   Double medicineCost, Double consultationCost, Double totalCost, String contactNumber) {
        this.id = id;
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.disease = disease;
        this.village = village;
        this.doctorAssigned = doctorAssigned;
        this.dateOfVisit = dateOfVisit;
        this.treatmentDetails = treatmentDetails;
        this.medicineCost = medicineCost;
        this.consultationCost = consultationCost;
        this.totalCost = totalCost;
        this.contactNumber = contactNumber;
    }

    @PrePersist
    @PreUpdate
    public void calculateTotal() {
        this.totalCost = (medicineCost != null ? medicineCost : 0.0) +
                         (consultationCost != null ? consultationCost : 0.0);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDisease() { return disease; }
    public void setDisease(String disease) { this.disease = disease; }

    public String getVillage() { return village; }
    public void setVillage(String village) { this.village = village; }

    public String getDoctorAssigned() { return doctorAssigned; }
    public void setDoctorAssigned(String doctorAssigned) { this.doctorAssigned = doctorAssigned; }

    public LocalDate getDateOfVisit() { return dateOfVisit; }
    public void setDateOfVisit(LocalDate dateOfVisit) { this.dateOfVisit = dateOfVisit; }

    public String getTreatmentDetails() { return treatmentDetails; }
    public void setTreatmentDetails(String treatmentDetails) { this.treatmentDetails = treatmentDetails; }

    public Double getMedicineCost() { return medicineCost; }
    public void setMedicineCost(Double medicineCost) { this.medicineCost = medicineCost; }

    public Double getConsultationCost() { return consultationCost; }
    public void setConsultationCost(Double consultationCost) { this.consultationCost = consultationCost; }

    public Double getTotalCost() { return totalCost; }
    public void setTotalCost(Double totalCost) { this.totalCost = totalCost; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }
}
