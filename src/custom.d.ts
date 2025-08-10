// src/custom.d.ts

// EyeDropper 인터페이스를 정의합니다.
// 이 인터페이스는 EyeDropper 생성자와 open() 메서드를 포함합니다.
declare class EyeDropper {
    constructor();
    open(): Promise<{ sRGBHex: string }>;
  }
  
  // Window 인터페이스를 확장하여 EyeDropper 속성을 추가합니다.
  // '?'를 사용하여 EyeDropper가 존재하지 않을 수도 있음을 나타냅니다.
  interface Window {
    EyeDropper?: EyeDropper;
  }