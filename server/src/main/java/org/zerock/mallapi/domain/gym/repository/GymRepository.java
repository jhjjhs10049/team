package org.zerock.mallapi.domain.gym.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.zerock.mallapi.domain.gym.entity.Gym;

@Repository
public interface GymRepository extends JpaRepository<Gym, Long> {
}