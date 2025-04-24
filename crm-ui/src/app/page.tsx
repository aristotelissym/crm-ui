'use client'

import React, { useEffect, useState } from 'react'
// import axios from 'axios'

export default function Dashboard() {
  const [totalCount, setTotalCount] = useState(0)
  const [expertiseCount, setExpertiseCount] = useState(0)
  const [someOtherCount, setSomeOtherCount] = useState(0)

  // useEffect(() => {
  //   axios.get('http://localhost:4000/members').then((res) => {
  //     const data = res.data
  //     setTotalCount(data.length)
  //     setExpertiseCount(
  //       data.filter((member: any) => member.expertise === 'ΓενικήΟικογενειακή Ιατρική').length
  //     )
  //     setSomeOtherCount(
  //       data.filter((member: any) => member.sector === 'Δημόσιος').length // Example
  //     )
  //   })
  // }, [])

  return (
    <div className="p-4 space-y-6">
      {/* First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">Σύνολο Μελών</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">Γενική Οικογενειακή Ιατρική</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{expertiseCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">Τομέας Δημόσιος</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{someOtherCount}</p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-secondary">Μεγάλο Section</h3>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mt-2"></div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-secondary">Μικρό Section</h3>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mt-2"></div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-secondary">Μικρό Section</h3>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mt-2"></div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-secondary">Μεγάλο Section</h3>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mt-2"></div>
        </div>
      </div>
    </div>
  )
}
