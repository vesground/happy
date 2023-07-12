import { MODAL_RECORD_EMOTIONS } from './consts';
import { mapEmotionsIds } from 'components/dashboard/helpers';

import globalStyles from 'styles/global.module.scss';

export default function RecordEmotion({ id, emotions, dayDate, openModal }) {
  return (
    <p
      className={globalStyles.textRegular}
      onClick={openModal({ id, emotions: emotions.map(mapEmotionsIds), dayDate }, MODAL_RECORD_EMOTIONS)}
    >
      {emotions.map((emotion, index) => (
        <span key={index}>
          {0 === index ? emotion.name : emotion.name.toLowerCase()}
          {emotions.length - 1 === index ? '' : ', '}
        </span>
      ))}
    </p>
  );
}
