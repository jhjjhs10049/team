package org.zerock.mallapi.repository.Member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.Member.Member;
import org.zerock.mallapi.domain.Member.MemberStatus;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    
    @Query("select m from Member m where m.email = :email and m.active = :status")
    Optional<Member> getWithRoles(@Param("email") String email, @Param("status") MemberStatus status);
    
    // 이메일로 회원 찾기 (활성 상태만)
    @Query("select m from Member m where m.email = :email and m.active = 'ACTIVE'")
    Optional<Member> findByEmailAndActiveStatus(@Param("email") String email);
    
    // 닉네임으로 회원 찾기
    Optional<Member> findByNickname(String nickname);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
    
    // 닉네임 존재 여부 확인
    boolean existsByNickname(String nickname);
    
    // 기존 호환성을 위한 메서드
    default Member getWithRoles(String email) {
        return getWithRoles(email, MemberStatus.ACTIVE).orElse(null);
    }
}
 