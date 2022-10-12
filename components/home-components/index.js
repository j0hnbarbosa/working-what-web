import { useState } from 'react'
import { useQuery, gql } from '@apollo/client';
import _ from 'lodash';

import styles from './styles.module.scss';
import moment from 'moment';
import InputLabel from '../input-label';
import { KEY } from '../../utils/constants/keyboard-keys'
import Modal from '../modal';
import Button from '../button';
import { GET_ACTIVITIES } from './graphql';

const FORMAT_DATE = "YYYY-MM-DD"

function HomeComponent() {
  const [initialHour, setInitialHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [description, setDescription] = useState("");
  const [workingData, setWorkingData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const today = moment().format(FORMAT_DATE);

  const { loading, error, data } = useQuery(GET_ACTIVITIES);


  const formatTime = (time = "") => {
    if (!time) return "";

    return moment(`${today} ${time}`)
  }

  console.log("workingData", workingData)

  const formatHourMinute = (value) => {
    if (!value) return "";

    return value
      .replace(/[^:\d]/g, '')
      .replace(/(.*?)(\d{2}):(\d{2})(.*)/, "$2:$3")
      .replace(/(.*?)(\d{2})(\d{2})(.*)/, "$2:$3")
      .replace(/(\d{1})(\d{1})(\d{1})/, "$1$2:$3")
      .replace(/(\d{1})(\d{1}):(\d{2})/, "$1$2:$3")
      .replace(/([3-9]{1})(\d{1})(\d{2})/, "0$2:$3")
      .replace(/([3-9]{1})(\d{1}):(\d{2})/, "0$2:$3")
      .replace(/([2]{1})([4-9]{1})(\d{2})/, "$13:$3")
      .replace(/([2]{1})([4-9]{1}):(\d{2})/, "$13:$3")
      .replace(/([3-9]{1})(\d{1})(\d{1})(\d{1})/, "0$2:$3$4")
      .replace(/([3-9]{1})(\d{1}):(\d{1})(\d{1})/, "0$2:$3$4")
      .replace(/([0-2]{1})(\d{1}):([6-9]{1})(\d{1})/, "$1$2:5$4")
      .replace(/([0-2]{1})(\d{1}):([0-5]{1})(\d{1})/, "$1$2:$3$4")
  }

  const handleInitialHour = ({ target }) => {
    setInitialHour(formatHourMinute(target.value));
  };

  const handleEndHour = ({ target }) => {
    setEndHour(formatHourMinute(target.value));
  };

  const handleDescription = ({ target }) => {
    setDescription(target.value);
  };


  const handleAddTime = () => {
    const diffHours = formatTime(endHour).diff(formatTime(initialHour), "hours");
    const diffMinutes = formatTime(endHour).diff(formatTime(initialHour), "minutes");
    const timeSpent = `${diffHours}h:${diffMinutes % 60}m`;
    const values = {
      initialHour: `${today} ${initialHour}`,
      endHour: `${today} ${endHour}`,
      description,
      timeSpent,
      status: 'In Progrees',
      date: today,
    }
    setWorkingData((prev) => [values, ...prev]);
  };

  const handlePressEnter = (event) => {
    if (event && event.key) {
      if (event.key === KEY.ENTER && initialHour.length === 5 && endHour.length === 5) {
        handleAddTime();
      }
    }
  }

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
    setEndHour("");
    setInitialHour("");
    setDescription("");
  }

  const comparaeFc = (a, b, field) => {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  }

  let temp = null;

  if (loading || error) return <div className={`${styles.container} ${styles.containerCenter}`}>
    {error && error.message}
    {loading && "Loading..."}
  </div>

  const { activities = [] } = data;

  return (
    <>
      <div>
        <main className={styles.container}>
          <div className={styles.containerCenter}>
            <Button
              label='Adicionar Hora'
              onClick={handleOpen}
            />
          </div>

          <table className={`${styles.tableStyles} ${styles.marginTop}`}>
            <thead>
              <tr>
                <th>Hora Inicio</th>
                <th>Hora Fim</th>
                <th>Tempo Gasto</th>
                <th>Tarefa</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {_.chain(activities)
                .orderBy((item) => moment(item.dateWork), "desc")
                .map((item, index) => {

                  let showNextDate = false;
                  console.log(temp, item.dateWork)
                  if (temp !== item.dateWork) {
                    temp = item.dateWork;
                    showNextDate = true;
                  }

                  return (
                    <>
                      <tr key={item.id}>
                        <td>{moment(item.initialHour).format("hh:mm")}</td>
                        <td>{moment(item.endHour).format("hh:mm")}</td>
                        <td>{item.spentTime}</td>
                        <td>{item.description}</td>
                        <td>{item.status}</td>
                      </tr>
                      {(showNextDate || index === 0) && (
                        <tr key={item.dateWork} className={styles.rowDate}>
                          <td colSpan={5}>
                            {moment(item.dateWork).format("DD/MM/yyyy")}
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })
                .value()}
            </tbody>
          </table>
        </main>
      </div>

      <Modal
        open={isOpen}
        onClose={handleClose}
        header="Cadastrar atividade"
      >
        <div className={styles.containerTime}>
          <InputLabel
            label='Hora Inicial'
            name='intialHour'
            value={initialHour}
            onChange={handleInitialHour}
            onKeyDown={handlePressEnter}
            placeholder="00:00"
          />

          <InputLabel
            label='Hora Final'
            name='endHour'
            value={endHour}
            onChange={handleEndHour}
            onKeyDown={handlePressEnter}
            placeholder="00:00"
          />
        </div>

        <div className={`${styles.containerCenter} ${styles.marginTop}`}>
          <label for="decriptionField">
            Descrição
            <textarea
              className={styles.textareaStyle}
              id="decriptionField"
              onChange={handleDescription}
              value={description}
            />
          </label>
        </div>

        <div className={`${styles.containerCenter} ${styles.marginTop}`}>
          <Button
            label='Adicionar Hora'
            onClick={handleAddTime}
          />
        </div>
      </Modal>

    </>
  )
}

export default HomeComponent