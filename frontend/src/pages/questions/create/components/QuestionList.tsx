import { useState } from "react";
import useQuestionFormStore from "@/pages/questions/create/stores/useQuestionFormStore";
import QuestionItem from "./QustionItem";
import EditInput from "./EditInput";

const QuestionList = () => {
  const questionList = useQuestionFormStore((state) => state.questionList);
  const deleteQuestion = useQuestionFormStore((state) => state.deleteQuestion);
  const updateQuestion = useQuestionFormStore((state) => state.updateQuestion);

  const [editingId, setEditingId] = useState("");
  const [editValue, setEditValue] = useState("");

  const editHandler = (id: string, content: string) => {
    setEditingId(id);
    setEditValue(content);
  };

  const handleSave = () => {
    if (editingId && editValue.trim()) {
      updateQuestion(editingId, editValue.trim());
      setEditingId("");
      setEditValue("");
    }
  };

  const handleCancel = () => {
    setEditingId("");
    setEditValue("");
  };

  return (
    <div className="flex flex-col gap-3">
      {questionList.map((question) => (
        <div key={question.id}>
          {editingId === question.id ? (
            <EditInput
              value={editValue}
              onChange={setEditValue}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ) : (
            <QuestionItem
              content={question.content}
              onDelete={() => deleteQuestion(question.id)}
              onEdit={() => editHandler(question.id, question.content)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
