import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styles from '../css/todo.module.css'

const TodoItem = ({
  editingTodoId,
  startEditingTodo,
  isDeleting,
  deleteTodo,
  setIsRenderingTodoInfo,
  title,
  id,
}) => {
  const navigate = useNavigate()

  return (
    <div>
      <button
        className={editingTodoId === id ? styles.hidden : 'custom-button'}
        onClick={() => {
          startEditingTodo(id, title)
          console.log(typeof id)
        }}
      >
        Изменить
      </button>
      <button
        className='custom-button'
        disabled={isDeleting}
        onClick={() => {
          deleteTodo(id)
          console.log('!')
        }}
      >
        Выполнено
      </button>
      <button className='custom-button'>
        <Link
          to='/'
          onClick={() => {
            setIsRenderingTodoInfo(false)
            navigate(-1, { replace: true })
          }}
        >
          Назад
        </Link>
      </button>
    </div>
  )
}

export default TodoItem
