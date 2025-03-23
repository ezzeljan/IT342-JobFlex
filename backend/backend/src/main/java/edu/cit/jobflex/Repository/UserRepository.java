package edu.cit.jobflex.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import edu.cit.jobflex.Entity.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
	UserEntity findByEmail(String email);
}