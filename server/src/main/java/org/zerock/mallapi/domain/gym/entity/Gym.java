package org.zerock.mallapi.domain.gym.entity;

import jakarta.persistence.*;
import lombok.*;
import org.zerock.mallapi.domain.trainer.entity.Trainer;

import java.util.ArrayList;
import java.util.List;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Table(name = "gym")
@Getter
@NoArgsConstructor(access = PROTECTED)
@AllArgsConstructor(access = PROTECTED)
@Builder
public class Gym {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "gym_no")
    private Long gymNo;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "phone_number", length = 30)
    private String phoneNumber;

    @Column(name = "opening_hours", length = 255)
    private String openingHours;

    @ElementCollection
    @CollectionTable(name = "gym_facilities", joinColumns = @JoinColumn(name = "gym_no"))
    @Column(name = "facility")
    @Builder.Default
    private List<String> facilities = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "gym_image", joinColumns = @JoinColumn(name = "gym_no"))
    @Column(name = "image_url", length = 1024, nullable = false)
    @Builder.Default
    private List<String> imageList = new ArrayList<>();

    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Trainer> trainerList = new ArrayList<>();

    @OneToMany(mappedBy = "gym", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<GymReview> reviews = new ArrayList<>();

    @Column(name = "location_x", nullable = false)
    private Double locationX;

    @Column(name = "location_y", nullable = false)
    private Double locationY;
}