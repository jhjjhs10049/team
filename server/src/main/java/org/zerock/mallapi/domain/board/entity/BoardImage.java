package org.zerock.mallapi.domain.board.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class BoardImage {

    @Column(name = "file_name")
    private String fileName;

    @Column(name = "ord")
    private int ord;
}