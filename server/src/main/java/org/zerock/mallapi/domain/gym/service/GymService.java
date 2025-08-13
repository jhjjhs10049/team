package org.zerock.mallapi.domain.gym.service;

import org.zerock.mallapi.domain.gym.dto.GymDetailDTO;

import java.util.Map;

public interface GymService {
    public GymDetailDTO getGym(Long gymNo, Long memberNo);
    Map<String, Object> setFavorite(Long gymNo, Long memberNo, boolean favorite);
}