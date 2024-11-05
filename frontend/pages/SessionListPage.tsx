

const SessionListPage = () => {


  return (
    <section className={'flex flex-col gap-10'}>
      <div>헤더
        <h1>스터디 세션 목록</h1>
        <div>
          <input type="text" placeholder="세션을 검색하세요" />
          <select>
            
          </select>
          <button>+</button>
          <button>링크입력</button>
        </div>
      </div>
      <div>
        <h2>공개된 세션 목록</h2>
        <div>

        </div>
      </div>
      <div>진행 중인 세션 목록</div>

    </section>
  )
}

export default SessionListPage