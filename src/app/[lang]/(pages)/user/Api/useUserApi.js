// 'use client'
import { useEffect, useState } from 'react'

import axios from 'axios'

import { USER_MODULE_ENDPOINTS } from '../Const/ApiEndpoints'

export default function useUserApi() {
  const [data, setData] = useState([])

  const fetchData = () => {
    try {
      axios.get(`${USER_MODULE_ENDPOINTS}`)?.then(res => {
        setData(res?.data)
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addUsersData = userData => {
    try {
      axios.post(`${USER_MODULE_ENDPOINTS}`, userData).then(() => fetchData())

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateUsersData = (userId, userData) => {
    try {
      axios.put(`${USER_MODULE_ENDPOINTS}/${userId}`, userData).then(() => fetchData())

      //   return response.data
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteUserData = userId => {
    try {
      axios.delete(`${USER_MODULE_ENDPOINTS}/${userId}`).then(() => fetchData())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return {
    deleteUserData,
    updateUsersData,
    addUsersData,
    data,
    setData
  }
}
