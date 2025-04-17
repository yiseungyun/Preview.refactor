import { RoomMetadata } from "../../types/Channel";

interface StudyRoomProps {
  roomMetadata: RoomMetadata;
  startStudySession: () => void;
  stopStudySession: () => void;
}

const studyButtonClass = "bg-transparent rounded-xl border h-10 px-3 py-2 text-medium-xs";

const StudyRoomControl = ({
  roomMetadata,
  startStudySession,
  stopStudySession,
}: StudyRoomProps) => {
  return (
    <div className="inline-flex gap-4 items-center mx-8">
      {
        roomMetadata.inProgress ?
          <button
            className={studyButtonClass}
            onClick={stopStudySession}
          >
            스터디 종료하기
          </button>
          : <button
            className={studyButtonClass}
            onClick={startStudySession}
          >
            스터디 시작하기
          </button>
      }
    </div>
  )
}

export default StudyRoomControl;