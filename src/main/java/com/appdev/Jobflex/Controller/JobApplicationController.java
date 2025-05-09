package com.appdev.Jobflex.Controller;

import com.appdev.Jobflex.Entity.JobApplicationEntity;
import com.appdev.Jobflex.Entity.JobPostEntity;
import com.appdev.Jobflex.Entity.JobSaveEntity;
import com.appdev.Jobflex.Entity.UserEntity;
import com.appdev.Jobflex.Repository.JobApplicationRepository;
import com.appdev.Jobflex.Repository.JobPostRepository;
import com.appdev.Jobflex.Repository.JobSaveRepository;
import com.appdev.Jobflex.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class JobApplicationController {
    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobPostRepository jobPostRepository;

    @Autowired
    private JobSaveRepository jobSaveRepository;


    @PostMapping("/apply")
    public String applyForJob(@RequestParam int userId, @RequestParam int jobPostId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobPostEntity jobPost = jobPostRepository.findById(jobPostId).orElse(null);

        if (user == null || jobPost == null) {
            return "User or Job not found.";
        }

        if (!"Job Seeker".equalsIgnoreCase(user.getUserType())) {
            return "Only Job Seekers can apply.";
        }

        // NEW: Check if the user has already applied for this job
        Optional<JobApplicationEntity> existingApplication = jobApplicationRepository
                .findByApplicant_UserIdAndJobPostId(userId, jobPostId);

        if (existingApplication.isPresent()) {
            return "You have already applied for this job.";
        }

        // Create new application if user hasn't applied already
        JobApplicationEntity application = new JobApplicationEntity(user, jobPost);
        jobApplicationRepository.save(application);

        return "Application submitted successfully!";
    }


    @GetMapping("/applications/{userId}")
    public ResponseEntity<List<JobApplicationEntity>> getUserApplications(@PathVariable int userId) {
        List<JobApplicationEntity> applications = jobApplicationRepository.findByApplicant_UserId(userId);

        if (applications.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(applications, HttpStatus.OK);
    }

    @PostMapping("/save")
    public String saveJobPost(@RequestParam int userId, @RequestParam int jobPostId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        JobPostEntity jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new RuntimeException("Job Post not found"));

        if (!"Job Seeker".equalsIgnoreCase(user.getUserType())) {
            return "Only Job Seekers can save jobs.";
        }

        // Check if the user has already saved this job
        Optional<JobSaveEntity> existingSavedJob = jobSaveRepository.findByUserAndJobPost(user, jobPost);
        if (existingSavedJob.isPresent()) {
            return "You have already saved this job.";
        }

        // Save the job post along with all its attributes in JobSaveEntity
        JobSaveEntity savedJob = new JobSaveEntity(user, jobPost);
        jobSaveRepository.save(savedJob);

        return "Job saved successfully!";
    }


}
