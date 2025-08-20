package org.zerock.mallapi.global.exception;

import lombok.Getter;
import org.springframework.security.core.AuthenticationException;
import org.zerock.mallapi.domain.admin.dto.BannedDTO;

@Getter
public class BannedMemberException extends AuthenticationException {
    private final BannedDTO banInfo;
    
    public BannedMemberException(String message, BannedDTO banInfo) {
        super(message);
        this.banInfo = banInfo;
    }
}
