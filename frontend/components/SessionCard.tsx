
interface Props {
  category: string;
  title: string;
  host: string;
  participant: number;
  maxParticipant: number;
  sessionStatus: 'open' | 'close';
  questionListId: number;
}

const SessionCard =({ category, title, host, participant, maxParticipant,sessionStatus,questionListId}: Props) => {


  return (
    <li className={'flex rounded-2xl overflow-hidden'}>
      <div className={`${sessionStatus === 'open' ? 'bg-yellow-50': 'bg-green-950'}bg-yellow-50 w-6`} aria-label={'상태표시등'} />
      <div>
        <div>
          <span className={'border rounded-2xl py-1.5 px-3'}>{category}</span>
          <h3 className={'text-xl'}>{title}</h3>
          <p>질문지인데 누르면 질문 리스트를 볼 수 있임</p>
          <div>
            <span>{host} • </span>
            <span>{participant}/{maxParticipant}</span>
            <button>참여하기</button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SessionCard