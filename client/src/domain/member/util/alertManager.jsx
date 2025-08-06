// 중복 alert 방지를 위한 전역 상태 관리
class AlertManager {
  constructor() {
    this.isShowing = false;
    this.currentMessage = "";
  }

  showAlert(message) {
    // 같은 메시지가 이미 표시 중이면 무시
    if (this.isShowing && this.currentMessage === message) {
      return false;
    }

    this.isShowing = true;
    this.currentMessage = message;

    alert(message);

    // 1초 후 플래그 해제
    setTimeout(() => {
      this.isShowing = false;
      this.currentMessage = "";
    }, 1000);

    return true;
  }
}

// 싱글톤 인스턴스 생성
const alertManager = new AlertManager();

export default alertManager;
