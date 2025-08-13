package org.zerock.mallapi.domain.gym.repository;

import org.zerock.mallapi.domain.gym.entity.GymReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GymReviewRepository extends JpaRepository<GymReview, Long> {
    List<GymReview> findByGym_GymNo(Long gymNo);

    @Query("SELECT COALESCE(AVG(r.score), 0) FROM GymReview r WHERE r.gym.gymNo = :gymNo")
    Double findAverageScoreByGymNo(@Param("gymNo") Long gymNo);
}