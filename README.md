# 도서 관리 서비스
*Aivle School 8기 4차 미니 프로젝트*
1반 2조 
---

##  프로젝트 소개

**나만의 책장 서비스**는 사용자가 직접 글을 작성해서 **나만의 책을 만들고**,  
AI를 이용해 **표지 이미지를 생성**해서 꾸미고,  
YES24에서 가져온 **외부 도서 정보까지 검색**할 수 있는 웹 서비스입니다.

단순한 CRUD 예제에서 끝나는 것이 아니라,

- 회원가입 / 로그인 같은 **기본 인증 플로우**부터,
- 내가 작성한 책을 등록·조회·수정·삭제하는 **도서 관리 기능**,
- Jsoup으로 YES24를 크롤링하는 **실시간 도서 검색 기능**,
- OpenAI를 활용한 **AI 표지 이미지 생성 → 서버에 URL 저장**

까지 한 번에 경험할 수 있도록 설계했습니다.

백엔드와 프론트엔드는 각각 독립된 서버로 동작하며 REST API로 통신합니다.

- **Backend:** Spring Boot (기본 포트: `8080`)
- **Frontend:** Next.js (기본 포트: `3000`)

---

## 기술 스택

### Backend

- **Java 17**
- **Spring Boot 3.5.8**
- **Spring Web** – REST API 개발
- **Spring Data JPA** – ORM & DB 연동
- **H2 Database** – 개발용 인메모리/파일 DB
- **Jsoup** – YES24 도서 정보 HTML 크롤링
- **Lombok** – 보일러플레이트 코드 제거
- **Gradle** – 빌드 & 의존성 관리

### Frontend

- **Next.js (React 기반)**
- **React Hooks** – 상태 관리 (`useState`, `useEffect`, `useRouter` 등)
- **MUI** – UI 컴포넌트 라이브러리
- **Axios** – 백엔드 API 통신
- **fetch** – OpenAI 이미지 API 직접 호출
- **NPM** – 의존성 관리

---

## 주요 기능

### 1.  사용자 관리

- **회원가입 (`/user/join`)**
  - 이메일, 비밀번호, 이름, 전화번호 입력
  - 이메일 중복 체크
  - 필수값 누락, 비밀번호 형식 등 유효성 검증
  - 예외 상황에 대해 명확한 메시지와 HTTP Status 코드 반환

- **로그인 (`/user/login`)**
  - 이메일 + 비밀번호로 로그인
  - 성공 시 `HttpSession`에 `userId` 저장
  - 이후 API에서 세션 기반으로 사용자 식별 가능하도록 설계

- **로그아웃 (설계)**
  - 세션 무효화 기반 로그아웃을 고려하여 구조 설계

- **아이디/비밀번호 찾기, 비밀번호 재설정 (설계)**
  - 이메일 기반 조회 및 임시 비밀번호 발급 등 확장이 가능한 형태로 API 설계

---

### 2. 나만의 책 만들기

- **도서 등록**
  - 제목, 내용, 저자, (선택) 기본 표지 이미지 URL을 입력해 책 생성
- **도서 목록 조회**
  - 사용자가 등록한 책 목록을 카드 형태로 조회
- **도서 상세 조회**
  - 책을 클릭하면 상세 페이지로 이동하여 내용, 표지, 작성/수정 시간 등을 확인
- **도서 수정**
  - 상세 페이지에서 제목, 내용, 표지 이미지 등을 수정
- **도서 삭제**
  - 더 이상 필요 없는 책을 삭제

여기에 **AI 표지 이미지 생성 기능**이 연동되어, 사용자가 만든 책을 실제 책처럼 꾸밀 수 있습니다.

---

### 3.  YES24 도서 검색

- 사용자가 키워드를 입력하면 YES24 도서 검색 결과 페이지를 **Jsoup**으로 크롤링
- 도서 **제목 / 저자 / 표지 이미지**를 파싱 후 백엔드에서 JSON으로 반환
- 프론트엔드에서 해당 결과를 리스트 형태로 렌더링
- 필요 시 YES24 상세 페이지로 이동하도록 설계

이를 통해 **내가 만든 책 + 실제 서점 도서 정보**를 동시에 탐색할 수 있습니다.

---

### 4.  AI 표지 이미지 생성

4일차 핵심 미션은 **OpenAI 이미지 API를 이용해 도서 표지를 생성하는 것**입니다.

1. 사용자가 **도서 상세 페이지**에서 “AI 표지 생성” 버튼 클릭  
2. (필요할 경우) 본인의 **OpenAI API Key**를 입력  
3. 프론트엔드에서 책 제목/내용을 기반으로 prompt 생성  
4. `fetch`를 이용해 OpenAI 이미지 생성 API 호출  
5. 응답으로 전달받은 **이미지 URL**을 추출해 화면에 미리보기로 표시  
6. 사용자가 “이 이미지를 표지로 저장”을 선택하면
   - 백엔드 API(`PATCH /book/createImg/{bookId}`)로 이미지 URL 전송
   - 백엔드에서 해당 도서의 `coverImageUrl` 필드를 업데이트 후 DB에 반영
7. 이후 목록/상세 페이지에서 **AI로 생성한 표지 이미지**가 표시됨

추가로,

- 생성 중에는 “표지 생성 중…” 과 같은 안내 문구 및 로딩 상태 관리  
- 실패 시 에러 메시지를 보여주고 기존 표지를 유지해 UX를 보완

---


## 백엔드 상세 API 명세

> 이 섹션은 Postman 테스트용으로 정리한 백엔드 API 목록입니다.  
> 실제 프로젝트에서 구현한 **검증 / 예외 처리 / 동작 흐름** 기준으로 작성했습니다.

---

### 4-1. 사용자 인증

#### 4-1-1. 회원가입

- **URL**: `POST /user/join`
- **설명**
  - 이메일 중복을 검사한 뒤 신규 회원을 저장한다.
  - 잘못된 이메일, 비밀번호 정책 미충족, 비밀번호 재확인 불일치 등에 대해 **자세한 에러 메시지**를 반환한다.

##### Request Body

~~~json
{
  "email": "test@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "nickname": "홍길동",
  "phone": "010-1234-5678"
}
~~~

##### 동작

- `UserSignUpRequest` DTO로 요청 데이터를 매핑
- `UserService.signUp()`에서 순서대로 검증
  - 이메일 형식 검증 (정규식)
  - 비밀번호 / 비밀번호 확인 일치 여부
  - 비밀번호 정책 검사 (길이, 대/소문자, 숫자, 특수문자 포함 여부)
  - 이미 가입된 이메일인지 **중복 체크**
- 검증이 모두 통과하면 `UserInfo` 엔티티를 생성해 DB에 저장
- 저장된 사용자의 `userId`, `email`을 응답으로 반환

##### Response (성공 – 201 Created)

~~~json
{
  "status": "success",
  "message": "회원가입 성공",
  "data": {
    "userId": 1,
    "email": "test@example.com"
  }
}
~~~

##### 예외 케이스 (예시)

- **이메일 중복**
  - HTTP 400
  - 메시지: `"이미 가입된 이메일입니다."`
- **비밀번호 정책 위반 / 불일치**
  - HTTP 400  
    예: `"비밀번호 형식을 다시 확인해주세요."`, `"비밀번호와 확인 비밀번호가 일치하지 않습니다."`
- **기타 서버 오류**
  - HTTP 500  
    메시지: `"서버 내부 오류가 발생했습니다. 관리자에게 문의해주세요."`

---

#### 4-1-2. 로그인

- **URL**: `POST /user/login`
- **설명**
  - 이메일과 비밀번호로 로그인하고, 성공 시 `HttpSession`에 `user`(userId)를 저장한다.

##### Request Body

~~~json
{
  "email": "test@example.com",
  "password": "Password123!"
}
~~~

##### 동작

- `LoginService`에서 `email + password`로 사용자 조회
- 일치하는 사용자가 있을 경우
  - 세션에 `user` 속성으로 `userId` 저장
- 로그인 실패 시
  - 적절한 에러 메시지와 상태 코드 반환  
    (예: 401 Unauthorized, `"이메일 또는 비밀번호가 올바르지 않습니다."`)

##### Response (성공 – 200 OK)

~~~text
로그인 성공
~~~

---

### 4-2. 도서 관리 API

#### 4-2-1. 나만의 도서 목록 조회

- **URL**: `GET /book/list`
- **설명**
  - 로그인한 사용자가 작성한 도서 목록을 **최신순**으로 조회한다.

##### 예시 Request

~~~http
GET /book/list
~~~

##### Response (성공 – 200 OK)

~~~json
[
  {
    "bookId": 1,
    "title": "첫 번째 책",
    "author": "작성자",
    "coverImageUrl": "https://example.com/image1.png",
    "createdAt": "2025-12-05T10:00:00",
    "updatedAt": null
  },
  {
    "bookId": 2,
    "title": "두 번째 책",
    "author": "작성자",
    "coverImageUrl": null,
    "createdAt": "2025-12-06T09:30:00",
    "updatedAt": null
  }
]
~~~

---

#### 4-2-2. 도서 상세 조회

- **URL**: `GET /book/detail/{id}`

##### 예시 Request

~~~http
GET /book/detail/1
~~~

##### Response (성공 – 200 OK)

~~~json
{
  "bookId": 1,
  "title": "첫 번째 책",
  "content": "내용…",
  "author": "작성자",
  "coverImageUrl": "https://example.com/image1.png",
  "createdAt": "2025-12-05T10:00:00",
  "updatedAt": null
}
~~~

---

#### 4-2-3. 도서 등록

- **URL**: `POST /book/insert`
- **설명**
  - 제목/내용/작성자를 입력받아 새로운 책을 생성한다.
  - 표지 이미지는 최초에는 `null`로 저장되며, 이후 AI 표지 생성 시 업데이트된다.

##### Request Body

~~~json
{
  "title": "새로운 책",
  "content": "책 내용입니다.",
  "author": "홍길동",
  "coverImageUrl": null
}
~~~

##### 동작

- 필수 값(제목, 내용 등) 유효성 검사
- 현재 로그인한 사용자 기준으로 `author` 또는 `userId` 매핑
- `Book` 엔티티 생성 후 DB 저장

##### Response (성공 – 201 Created)

~~~json
{
  "bookId": 3,
  "title": "새로운 책",
  "content": "책 내용입니다.",
  "author": "홍길동",
  "coverImageUrl": null,
  "createdAt": "2025-12-05T11:00:00",
  "updatedAt": null
}
~~~

---

#### 4-2-4. 도서 수정

- **URL**: `PUT /book/update/{id}`
- **설명**
  - 기존에 작성한 책의 제목/내용/표지 이미지를 수정한다.

##### Request Body

~~~json
{
  "title": "수정된 제목",
  "content": "수정된 내용입니다.",
  "coverImageUrl": "https://example.com/changed.png"
}
~~~

##### 동작

- `id`로 기존 도서를 조회
- 없으면 404 Not Found 에러 반환
- 요청 값으로 필드를 업데이트 후 DB 저장
- 수정된 도서 정보를 응답으로 반환

##### Response (성공 – 200 OK)

~~~json
{
  "bookId": 1,
  "title": "수정된 제목",
  "content": "수정된 내용입니다.",
  "author": "작성자",
  "coverImageUrl": "https://example.com/changed.png",
  "createdAt": "2025-12-05T10:00:00",
  "updatedAt": "2025-12-06T09:40:00"
}
~~~

---

#### 4-2-5. 도서 삭제

- **URL**: `DELETE /book/delete/{id}`
- **설명**
  - 더 이상 필요 없는 책을 삭제한다.

##### 예시 Request

~~~http
DELETE /book/delete/1
~~~

##### 동작

- `id`로 도서를 조회 후 존재하면 삭제
- 이미 삭제된 경우 404 Not Found 반환

##### Response (성공 – 204 No Content)

- 본문 없음

---

#### 4-2-6. AI 표지 이미지 URL 저장

- **URL**: `PATCH /book/createImg/{bookId}`
- **설명**
  - 프론트엔드에서 OpenAI API로 생성한 표지 이미지 URL을 전달하면,  
    해당 도서의 `coverImageUrl` 필드를 업데이트한다.

##### Request Body

~~~json
{
  "coverImageUrl": "https://generated-image-url-from-openai.com/image.png"
}
~~~

##### 동작

- `bookId`로 도서 엔티티 조회
- 없다면 404 Not Found
- `coverImageUrl` 필드를 요청 값으로 변경
- 변경된 도서를 저장한 뒤, 최종 도서 정보를 반환

##### Response (성공 – 200 OK)

~~~json
{
  "bookId": 1,
  "title": "나의 책",
  "content": "내용…",
  "author": "작성자",
  "coverImageUrl": "https://generated-image-url-from-openai.com/image.png",
  "createdAt": "2025-12-05T10:00:00",
  "updatedAt": "2025-12-06T10:20:00"
}
~~~

---

### 4-3. YES24 도서 검색 API

#### 4-3-1. 키워드 기반 도서 검색

- **URL**: `GET /books/search?query={keyword}`
- **설명**
  - YES24 검색 결과 페이지를 `Jsoup`으로 크롤링하여  
    **제목 / 저자 / 표지 이미지 / 상세 링크**를 파싱한 뒤 JSON 배열로 반환한다.

##### 예시 Request

~~~http
GET /books/search?query=자바
~~~

##### Response (성공 – 200 OK)

~~~json
[
  {
    "title": "자바의 정석",
    "author": "남궁성",
    "imageUrl": "https://image.yes24.com/.../java1.jpg",
    "link": "https://www.yes24.com/Product/Goods/123456"
  },
  {
    "title": "이펙티브 자바",
    "author": "조슈아 블로크",
    "imageUrl": "https://image.yes24.com/.../java2.jpg",
    "link": "https://www.yes24.com/Product/Goods/654321"
  }
]
~~~

---

### 4-4. AI 표지 이미지 생성 전체 플로우 (요약)

> 프론트엔드와 백엔드가 어떻게 연동되는지 **한 번에 보기 좋게 정리한 흐름**입니다.

1. 사용자가 도서 상세 페이지에서 **“AI 표지 생성”** 버튼 클릭  
2. 사용자가 본인의 **OpenAI API Key**를 입력  
3. 프론트엔드에서
   - 도서 제목/내용 + 사용자가 선택한 옵션(모델, 스타일, 품질 등)을 합쳐 **프롬프트** 생성
   - `fetch`를 사용해 `https://api.openai.com/v1/images/generations`에 POST 요청
   - 응답 JSON에서 생성된 표지 이미지 URL 추출
4. 생성된 URL을 **미리보기 이미지**로 화면에 표시  
5. 사용자가 **“이 이미지로 표지 저장”** 버튼을 누르면
   - 프론트엔드에서 `PATCH /book/createImg/{bookId}` 호출
   - Request Body에 `coverImageUrl`을 담아서 전송
6. 백엔드에서는
   - 해당 도서를 조회하고 `coverImageUrl` 필드 업데이트
   - DB 저장 후 변경된 도서 정보를 반환
7. 저장 성공 시
   - 목록/상세 페이지에서 새로 생성된 표지 이미지가 바로 반영
8. 에러 처리
   - 잘못된 API 키, 호출 제한 초과, OpenAI 응답 오류 등은  
     `coverGenerationError` 상태 값과 안내 문구로 관리하여  
     사용자가 원인을 파악할 수 있도록 했다.

---

