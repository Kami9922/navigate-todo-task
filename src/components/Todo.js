import { useEffect, useState } from 'react'
import styles from '../css/todo.module.css'
import TodoInputs from './TodoInputs'
import { Routes, Route, Link, Outlet } from 'react-router-dom'
import TodoItem from './TodoItem'
import NotFound from './NotFound'

const Todo = () => {
  //Отображение
  const [todos, setTodos] = useState([])
  //Создание
  const [inputCreateValue, setInputCreateValue] = useState('')
  //Изменение
  const [inputUpdateValue, setInputUpdateValue] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState(null)
  //Блокировка кнопок
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  //Флаг обновления компонента для useEffect
  const [refreshTodosFlag, setRefreshTodosFlag] = useState(false)
  //Поиск
  const [isSearching, setIsSearching] = useState(false)
  const [inputSearchValue, setInputSearchValue] = useState('')
  const [filteredTodos, setFilteredTodos] = useState([])
  //Сортировка
  const [isSortedAlphabetically, setIsSortedAlphabetically] = useState(false)
  //Открытие подробной информации
  const [renderTodoId, setRenderTodoId] = useState('')
  const [isRenderingTodoInfo, setIsRenderingTodoInfo] = useState(false)
  const [renderTodoTitle, setRenderTodoTitle] = useState('')

  const refreshTodos = () => setRefreshTodosFlag(!refreshTodosFlag)

  const sortTodosAlphabetically = () => {
    setIsSortedAlphabetically(!isSortedAlphabetically)
  }

  const startEditingTodo = (id, title) => {
    setEditingTodoId(id)
    setInputUpdateValue(title)
  }
  const renderTodoInfo = (id, title) => {
    setRenderTodoId(id)
    setRenderTodoTitle(title)
    setIsRenderingTodoInfo(true)
  }

  const transformToStandard = (item) => {
    if (!item) return renderTodoTitle
    const result = item.split('').map((el, index) => {
      if (index === 0) {
        return el.toUpperCase()
      } else {
        return el.toLowerCase()
      }
    })

    return result.join('')
  }

  useEffect(() => {
    setIsLoading(true)

    fetch('http://localhost:3005/todos')
      .then((loadedData) => loadedData.json())
      .then((loadedTodos) => {
        setTodos(loadedTodos)
        setFilteredTodos(loadedTodos)
      })
      .finally(() => setIsLoading(false))
  }, [refreshTodosFlag])

  useEffect(() => {
    const handleSearchAndSort = (searchValue) => {
      let filtered = todos

      if (searchValue) {
        filtered = todos.filter((todo) =>
          todo.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      }

      if (isSortedAlphabetically) {
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title))
      }

      setFilteredTodos(filtered)
    }

    handleSearchAndSort(inputSearchValue)
  }, [inputSearchValue, todos, isSortedAlphabetically])

  const createTodo = (e) => {
    e.preventDefault()
    setIsCreating(true)

    fetch('http://localhost:3005/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        userId: 1,
        id: new Date().valueOf(),
        title: transformToStandard(inputCreateValue),
        completed: false,
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then(() => {
        refreshTodos()
      })
      .finally(() => setIsCreating(false))
      .finally(() => setInputCreateValue(''))
  }

  const updateTodo = (id) => {
    setIsUpdating(true)

    fetch(`http://localhost:3005/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({
        title: transformToStandard(inputUpdateValue),
      }),
    })
      .then((rawResponse) => rawResponse.json())
      .then(() => {
        setEditingTodoId(null)
        setInputUpdateValue('')
        refreshTodos()
      })
      .finally(() => setIsUpdating(false))
  }

  const deleteTodo = (id) => {
    setIsDeleting(true)

    fetch(`http://localhost:3005/todos/${id}`, {
      method: 'DELETE',
    })
      .then((rawResponse) => rawResponse.json())
      .then(() => {
        refreshTodos()
      })
      .finally(() => setIsDeleting(false))
  }

  return (
    <div className={styles['todo-container']}>
      <button
        className={isSearching ? styles['search-active'] : styles.search}
        onClick={() => setIsSearching(!isSearching)}
      >
        Поиск дела
      </button>
      <TodoInputs
        createTodo={createTodo}
        inputSearchValue={inputSearchValue}
        setInputSearchValue={setInputSearchValue}
        setIsSearching={setIsSearching}
        isSearching={isSearching}
        setIsCreating={setIsCreating}
        isCreating={isCreating}
        refreshTodos={refreshTodos}
        setInputCreateValue={setInputCreateValue}
        inputCreateValue={inputCreateValue}
      />
      <button
        onClick={sortTodosAlphabetically}
        className={styles['sort-button']}
      >
        {isSortedAlphabetically
          ? 'Отсортировать по алфавиту'
          : 'Отсортировать по алфавиту'}
      </button>
      <Routes>
        <Route
          path='/'
          element={
            isLoading ? (
              <div className={styles.loader}></div>
            ) : (
              filteredTodos.map(({ id, title }) => {
                return (
                  <div className={styles.todo} key={id}>
                    {editingTodoId === id ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          updateTodo(id)
                        }}
                      >
                        <input
                          placeholder='Поменяйте дело...'
                          defaultValue={inputUpdateValue || title}
                          onChange={({ target }) => {
                            setInputUpdateValue(target.value)
                          }}
                        ></input>
                        <button
                          className='custom-button'
                          disabled={isUpdating}
                          type='submit'
                        >
                          Применить
                        </button>
                      </form>
                    ) : (
                      <>
                        <Link
                          to={`/task/${id}`}
                          className={
                            isRenderingTodoInfo && renderTodoId === id
                              ? styles['todo-title-active']
                              : styles['todo-title']
                          }
                          onClick={() => {
                            renderTodoInfo(id, title)
                          }}
                        >
                          {renderTodoId === id && isRenderingTodoInfo
                            ? title
                            : title.length > 19
                            ? title.substring(0, 19) + '...'
                            : title}
                        </Link>
                        {id === renderTodoId ? <Outlet /> : ''}
                      </>
                    )}
                  </div>
                )
              })
            )
          }
        >
          <Route
            path='task/:id'
            element={
              <TodoItem
                setIsRenderingTodoInfo={setIsRenderingTodoInfo}
                editingTodoId={editingTodoId}
                startEditingTodo={startEditingTodo}
                isDeleting={isDeleting}
                deleteTodo={deleteTodo}
                title={renderTodoTitle}
                id={renderTodoId}
              />
            }
          />
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default Todo
