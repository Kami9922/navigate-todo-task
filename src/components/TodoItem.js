import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../css/todoItem.module.css'

const TodoItem = ({
  editingTodoId,
  startEditingTodo,
  isDeleting,
  deleteTodo,
  setIsRenderingTodoInfo,
  title,
  id,
}) => {
  return (
    <div className={styles['todo-item']}>
      <div>
        <button
          className={editingTodoId === id ? styles.hidden : 'custom-button'}
          onClick={() => {
            startEditingTodo(id, title)
          }}
        >
          Изменить
        </button>
        <button
          className='custom-button'
          disabled={isDeleting}
          onClick={() => {
            deleteTodo(id)
          }}
        >
          Выполнено
        </button>
        <button
          className='custom-button'
          onClick={() => {
            setIsRenderingTodoInfo(false)
          }}
        >
          <Link to={'/'}>Назад</Link>
        </button>
      </div>
    </div>
  )
}

export default TodoItem
