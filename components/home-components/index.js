import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client';
import _ from 'lodash';
import moment from 'moment';
import { BsPencilFill } from 'react-icons/bs';

import styles from './styles.module.scss';
import InputLabel from '../input-label';
import { KEY } from '../../utils/constants/keyboard-keys'
import { STATUS_TEXT, STATUS_KEY } from '../../utils/constants/status'
import Modal from '../modal';
import Button from '../button';
import { GET_ACTIVITIES, CREATE_ACTIVITY, UPDATE_ACTIVITY } from './graphql';
import Message from '../message';

import { MoonLoader } from 'react-spinners'
import Dropdown from '../dropdown';

const FORMAT_DATE = "YYYY-MM-DD";
const FORMAT_TIME = "HH:mm";

const options = [
  { text: 'Andamento', value: STATUS_KEY.in_progress, key: STATUS_KEY.in_progress },
  { text: 'Finalizado', value: STATUS_KEY.finished, key: STATUS_KEY.finished },
  { text: 'Não Finalizado', value: STATUS_KEY.not_finished, key: STATUS_KEY.not_finished },
  {text: "Não Iniciado", value: STATUS_KEY.not_started, key: STATUS_KEY.not_started}
]

function HomeComponent() {
  const [initialHour, setInitialHour] = useState("");
  const [endHour, setEndHour] = useState("");
  const [status, setStatus] = useState(STATUS_KEY.not_started);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const todayMomment = moment().format(FORMAT_DATE);

  const [today, setToday] = useState(todayMomment);
  const [description, setDescription] = useState(`Frontedn test mutation ${todayMomment}`);
  const currentTime = moment().format(FORMAT_TIME);

  const { loading, error, data = {}, refetch } = useQuery(GET_ACTIVITIES);
  const [createActivity, { error: errorMutation, loading: loadingMutation }] = useMutation(CREATE_ACTIVITY)
  const [updateActivity, { error: errorUpdate, loading: loadingUpdate }] = useMutation(UPDATE_ACTIVITY);

  const formatTime = (time = "") => {
    if (!time) return "";

    return moment(`${today} ${time}`)
  }

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


  const handleAddTime = async () => {
    const diffHours = formatTime(endHour).diff(formatTime(initialHour), "hours");
    const diffMinutes = formatTime(endHour).diff(formatTime(initialHour), "minutes");
    const spentTime = `${diffHours}h:${diffMinutes % 60}m`;

    let values = {
      initialHour: moment(`${todayMomment} ${initialHour}`).utc(),
      endHour: moment(`${todayMomment} ${endHour}`).utc(),
      description,
      spentTime,
      status,
      dateWork: today || todayMomment,
    }

    if (id) {
      values = { ...values, id }
    }

    if (!isEdit) {
      await createActivity({
        variables: { attributes: values },
      });
    } else {
      await updateActivity({
        variables: { attributes: values },
      })
      setIsEdit(false);
    }

    await refetch();

    handleClose()
  };

  const handlePressEnter = (event) => {
    if (event && event.key) {
      if (event.key === KEY.ENTER && initialHour.length === 5 && endHour.length === 5) {
        handleAddTime();
      }
    }
  }

  const handleOpen = (initialize = false) => {
    if (initialize) {
      setInitialHour(currentTime);
      const newEndTime = formatTime(currentTime).add(50, "minutes").format(FORMAT_TIME);
      setEndHour(newEndTime);
    }
    setIsOpen(true);
  }
  const resetValues = () => {
    setEndHour("");
    setInitialHour("");
    setDescription("");
    setId("");
    setStatus(STATUS_KEY.not_started);
  }

  const handleClose = () => {
    setIsOpen(false);
    resetValues();
  }

  const getTime = (value) => {
    return moment(value).format(FORMAT_TIME);
  }

  const handleEdit = async (value) => {
    handleOpen();
    setIsEdit(true);

    setEndHour(getTime(value.endHour));
    setInitialHour(getTime(value.initialHour));
    setDescription(value.description);
    setStatus(value.status);
    setId(value.id);
    setToday(moment(value.dateWork).utc().format(FORMAT_DATE));
  }

  const handleDropdown = (item) => {
    setStatus(item.value);
  };

  const { activities = [] } = data;

  const orderData = () => {
    const resu = [];
    const rows = _.groupBy(activities, (item) => moment(item.dateWork).utc().format(FORMAT_DATE));
    const keys = _.chain(rows).keys().orderBy((item) => item, "desc").value();

    _.chain(keys)
      .forEach((key) => {

        _.chain(rows[key])
          .orderBy((item) => item.initialHour, 'desc')
          .forEach(item => {
            resu.push(
              <tr key={item.id}>
                <td>{moment(item.initialHour).format(`${FORMAT_DATE} ${FORMAT_TIME}`)}</td>
                <td>{moment(item.endHour).format(`${FORMAT_DATE} ${FORMAT_TIME}`)}</td>
                <td>{item.spentTime}</td>
                <td>{item.description}</td>
                <td className={styles[item.status] ? styles[item.status] : ''}>{STATUS_TEXT[item.status]}</td>
                <td onClick={() => handleEdit(item)} className={styles.edit}>{<BsPencilFill />}</td>
              </tr>
            )
          }).value()


        resu.push(
          <tr key={key} className={styles.rowDate}>
            <td colSpan={8}>
              {moment(key).utc().format("DD/MM/yyyy")}
            </td>
          </tr>
        )

      })
      .value()

    return resu;
  }

  return (
    <>
      <div>
        <main className={styles.container}>
          <div className={styles.messageContainer}>

            {(error || errorMutation || errorUpdate) && (
              <Message
                error
                message={error?.message || errorMutation?.message || errorUpdate?.message}
              />
            )}

            {(loading || loadingMutation || loadingUpdate) && (
              <MoonLoader size={24} />
            )}
          </div>

          <div className={styles.containerCenter}>
            <Button
              label='Cadastrar Hora'
              onClick={() => handleOpen(true)}
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
                <th>Editar</th>
              </tr>
            </thead>

            <tbody>
              {orderData()}
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
          <label for="decriptionField" className={styles.descriptionModal}>
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
          <Dropdown
            label='Status'
            options={options}
            onChange={handleDropdown}
          />
        </div>

        <div className={`${styles.containerCenter} ${styles.marginTop}`}>
          <Button
            label='Salvar'
            onClick={handleAddTime}
            disabled={loadingMutation || loadingUpdate}
            loading={loadingMutation || loadingUpdate}
          />
        </div>
      </Modal>

    </>
  )
}

export default HomeComponent