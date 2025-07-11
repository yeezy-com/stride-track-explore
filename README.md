# 러닝 코스 공유 서비스!

## Project info

**URL**: https://lovable.dev/projects/d4b44e93-8aa5-4f2b-8266-4cd7e5752eb2

## 사용자는 누구인가?

| 사용자 유형 | 정의 |
| --- | --- |
| 초보 러너 | 러닝을 시작하고 싶지만 어디를 뛰어야 할지 잘 모르는 초보 러너 |
| 고인물 러너 | 이미 오랜 기간 러닝을 하고 있으며, 여러 코스들을 알고있는 러너 |

## 페르소나

### 초보 러너 - 이재훈 (26세)

- 직업: 무직
- 전공: 네덜란드어학과
- 정의: 러닝을 하려할떄 어디를 뛰어야할지 몰라 쉽게 나서지 못하는 초보 러너
- 목표: 뛰기 좋은 러닝 코스를 통해 고수가 되고싶다.
- 니즈: 내 주변 러닝코스, 러닝 코스 별 난이도

### 고인물 러너 - 강기석 (26세)

- 직업: 사업가
- 전공: 컴퓨터공학과
- 정의: 러닝 코스를 다수 알고 있으며 이를 알려주기를 좋아하는 고급 러너
- 목표: 본인의 러닝 코스와 러닝 기록을 공유하고 싶어 한다.
- 니즈: 러닝 코스 공유

## 사용자 시나리오 및 스토리

### 러닝을 시작하려 하는 초보 러너

**상황**: 이재훈이 오랜만에 러닝을 하기 위해 나가고자 하지만, 주변에 어디를 뛰어야 본인 수준에 맞는지 몰라 고민 됨.

**사용자 시나리오**:

1. 스마트폰에서 코스쉐어 접속
2. 내 주변 러닝코스 클릭 또는 메인 화면
3. 인기순 및 최신순 정렬을 통해 확인
4. 마음에 드는 러닝 코스를 선택해 곧바로 러닝 기록 시작

**사용자 스토리**:

> “초보 러너인만큼, 동기부여 및 지속적인 러닝 습관을 위해 달리면서 풍경을 구경하거나, 언덕이나 내리막이 적은 러닝 코스들을 한눈에 확인하고 싶습니다.”
> 

**인수 조건**:

- Given: 사용자가 코스쉐어에 접속했을 때
- When: “내 주변 러닝 코스” 버튼을 클릭하거나 메인 화면에 있을 때
- Then: 인기순 또는 최신순으로 조건에 맞는 러닝 코스들을 보여준다

### 러닝을 즐겨하는 고인물 러너

**상황**: 강기석은 본인이 달린 코스가 마음에 들어 공유하고 싶지만, 어떤 곳에 공유할지 고민 됨.

**사용자 시나리오**:

1. 스마트폰에서 코스쉐어 접속
2. 추천 코스 추가하기 클릭
3. 코스에 대한 정보를 적고, 지도의 경로 표시 후 공유

**사용자 스토리**:

> “다른 러너들도 나처럼 좋은 러닝 코스를 뛰었으면 하는 마음으로 나의 러닝 코스를 공유하고 싶습니다. 그렇게해서 많은 러너들이 생겨나면 좋겠습니다.”
> 

**인수 조건**:

- Given: 사용자가 코스쉐어에 접속했을 때
- When: 러닝 코스를 등록하고 공유했을 때
- Then: 업로드한 러닝 코스를 다른 사용자들에게 공유한다.

### **핵심 가치 제안**

1. **코스 결정 지원**: 어떤 코스를 뛰어야 할지 모를때 사용자의 결정 피로 해소
2. **직관적인 사용성**: 복잡한 설정 없이 바로 사용 가능한 간편함
3. **러닝 밀착형 서비스**: 러닝마다 소소한 고민들에 대한 실질적 해결책

💡 **팁**: API 키 없이도 테스트하려면 기본 목업 응답이 제공됩니다.

### **핵심 기능**

- 색다른 러닝을 즐기고 싶거나, 이제 러닝을 시작하는 사람들에 대해 간단하고 직관적으로 러닝 코스를 제안

### **구현 범위**

- 실제 API 연동 없이 목업(Mocking) 데이터로 구현
