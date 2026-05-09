package com.ruralhealthcare.controller;

import com.ruralhealthcare.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalPatients", patientRepository.count());
        summary.put("totalRevenue", patientRepository.getTotalRevenue());
        return summary;
    }

    @GetMapping("/villages")
    public List<Map<String, Object>> getVillageStats() {
        return patientRepository.getVillageStatistics().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", obj[0]);
            map.put("value", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    @GetMapping("/diseases")
    public List<Map<String, Object>> getDiseaseStats() {
        return patientRepository.getDiseaseStatistics().stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", obj[0]);
            map.put("value", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }
}
