import { MODAL_RECORD_REASON } from 'utils/consts';

import globalStyles from 'styles/global.module.scss';

export default function RecordReason({ id, reason, dayDate, openModal }) {
  return (
    <p className={globalStyles.textSmall} onClick={openModal({ id, reason, dayDate }, MODAL_RECORD_REASON)}>
      {reason}
    </p>
  );
}
