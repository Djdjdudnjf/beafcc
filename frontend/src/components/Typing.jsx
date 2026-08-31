/** مؤشر الكتابة: ثلاث نقاط تتحرك أثناء انتظار أول كلمة من المساعد. */
import { AssistantIcon } from './Icons.jsx';

export function Typing({ assistant }) {
  return (
    <div className="msg msg--bot">
      <div className="msg__avatar" aria-hidden="true">
        <AssistantIcon name={assistant.icon} width="19" height="19" />
      </div>
      <div className="msg__bubble msg__bubble--bot typing" role="status" aria-label="المساعد يكتب">
        <span className="typing__dot" />
        <span className="typing__dot" />
        <span className="typing__dot" />
      </div>
    </div>
  );
}
