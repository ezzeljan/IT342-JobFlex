import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, TextField, Grid, Box } from "@mui/material";

const API_URL = "http://localhost:8080/api/jobs";

export default function JobPost() {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    pay: "",
    jobType: "",
    shiftAndSchedule: "",
    description: "",
    userId: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const res = await fetch(`${API_URL}/all`);
    const data = await res.json();
    setJobs(data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { userId, ...jobDetails } = formData;

    const res = await fetch(`${API_URL}/post?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobDetails)
    });

    alert(await res.text());
    fetchJobs();
    setFormData({
      title: "",
      company: "",
      location: "",
      pay: "",
      jobType: "",
      shiftAndSchedule: "",
      description: "",
      userId: ""
    });
  };

  const deleteJob = async (id, userId) => {
    if (window.confirm("Delete this job?")) {
      const res = await fetch(`${API_URL}/delete/${id}?userId=${userId}`, {
        method: "DELETE"
      });
      alert(await res.text());
      fetchJobs();
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        📋 Job Listings
      </Typography>
      <Grid container spacing={2} mb={4}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.company} | {job.location} | {job.jobType}
                </Typography>
                <Typography sx={{ mt: 1 }}>{job.description}</Typography>
                <Typography variant="body2">Pay: {job.pay} | Schedule: {job.shiftAndSchedule}</Typography>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => deleteJob(job.id, job.employer?.userId)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" gutterBottom>
        📝 Post a New Job
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        {[
          "title",
          "company",
          "location",
          "pay",
          "jobType",
          "shiftAndSchedule",
          "description",
          "userId"
        ].map((field) => (
          <TextField
            key={field}
            name={field}
            label={field.charAt(0).toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required={field !== "shiftAndSchedule"}
            fullWidth
          />
        ))}
        <Button type="submit" variant="contained">
          Post Job
        </Button>
      </Box>
    </Box>
  );
}
