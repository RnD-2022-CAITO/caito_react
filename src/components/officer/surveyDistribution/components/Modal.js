import style from './style.module.css';
import {createRef, useEffect, useState} from "react";
import {func} from "../../../../utils/firebase";
function Modal({onClose, onConfirm, defaultGroups = []}) {
  const ref = createRef();
  const [groups, setGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState(defaultGroups);
  const handleClick = (e) => {
    if (ref.current === e.target) {
      onClose && onClose();
    }
  }

  const handleConfirm = () => {
    onConfirm && onConfirm(selectedGroups);
  }

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelectedGroups([...selectedGroups, e.target.value])
    } else {
      setSelectedGroups(selectedGroups.filter(item => item !== e.target.value));
    }
  }

  const renderGroups = () => {
    return groups.map(group => {
      return (
        <div key={group.id} className={style.option}>
          <input checked={selectedGroups.includes(group.name)} value={group.name} onChange={handleChange} id={group.id} type={'checkbox'} />
          <label htmlFor={group.id}>{group.name}</label>
        </div>
      )
    })
  }

  useEffect(() => {
    const retrieveGroups = async () => {
      const getGroups = func.httpsCallable('group-findGroups');
      try {
        const res = await getGroups();
        setGroups(res.data)
      } catch (err) {
        console.log(err);
      }
    }
    retrieveGroups();
  }, []);
  return (
    <div ref={ref} onClick={handleClick} className={style.wrapper}>
      <div className={style.content}>
        <div className={style.contentHeader}>
          <h2>YOUR TARGET GROUP</h2>
        </div>
        <div className={style.contentCenter}>
          {renderGroups()}
        </div>
        <div className={style.contentFooter}>
          <div onClick={onClose} className={style.cancel}>CANCEL</div>
          <div onClick={handleConfirm} className={style.confirm}>CONTINUE</div>
        </div>
      </div>
    </div>
  )
}

export default Modal;