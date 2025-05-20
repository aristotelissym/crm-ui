'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { DB_Members } from '@/types'

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export default function Dashboard() {
  const [totalCount, setTotalCount] = useState(0)
  const [expertiseCount, setExpertiseCount] = useState(0)
  const [publicCount, setPublicCount] = useState(0)
  const [privateCount, setPrivateCount] = useState(0)
  const [researcherCount, setResearcherCount] = useState(0)
  const [trainerCount, setTrainerCount] = useState(0)
  const [noTrReCount, setNoTrReCount] = useState(0)
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    axios.get('http://localhost:4000/members').then((res) => {
      const data = res.data
      setTotalCount(data.length)
      setExpertiseCount(
        data.filter((member: DB_Members) => member.expertise === 'Γενική-Οικογενειακή Ιατρική').length
      )
      setPublicCount(
        data.filter((member: DB_Members) => member.sector === 'Δημόσιος').length // Example
      )
      setPrivateCount(
        data.filter((member: DB_Members) => member.sector === 'Ιδιωτικός').length // Example
      )
      setResearcherCount(
        data.filter((member: DB_Members) => member.role === 'Εκπαιδευτής').length // Example
      )
      setTrainerCount(
        data.filter((member: DB_Members) => member.role === 'Ερευνητής').length // Example
      )
      setNoTrReCount(
        data.filter((member: DB_Members) => member.role === 'Ερευνητής').length // Example
      )

      // Group by Expertise and count
      const expertiseMap = new Map<string, number>()
      data.forEach((member: DB_Members) => {
        const exp = member.expertise
        expertiseMap.set(exp, (expertiseMap.get(exp) || 0) + 1)
      })

      const labels = Array.from(expertiseMap.keys())
      const values = Array.from(expertiseMap.values())

      setChartData({
        labels,
        datasets: [
          {
            label: 'Αριθμός Ειδικοτήτων',
            data: values,
            backgroundColor: [
              '#FF6B6B',
              '#FFD93D',
              '#6BCB77',
              '#4D96FF',
              '#845EC2',
              '#F9F871',
              '#00C9A7',
              '#FFC75F',
              '#FF9671',
              '#D65DB1',
              '#0081CF'
            ],
            hoverBackgroundColor: '#FFDAC1',
            hoverOffset: 15
          }
        ]
      })
    })
  }, [])

  return (
    <div className="p-4 space-y-6">
      {/* First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">👥 Σύνολο Μελών</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">Τακτικά Μέλη</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{expertiseCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-stretch justify-items-center-safe">
          <div className='border-r border-primary mr-5 pr-5'>
            <h3 className="text-xl font-semibold text-primary">🏛️ Δημόσιος Τομέας</h3>
            <p className="text-3xl font-bold text-panellinio mt-2">{publicCount}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary">🏣 Ιδιωτικός Τομέας</h3>
            <p className="text-3xl font-bold text-panellinio mt-2">{privateCount}</p>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 align-center">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-primary">Κατανομή Ειδικοτήτων</h3>
          {/* {chartData && <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />} */}
          <div className='items-center ml-4 justify-center flex h-[250px]'>
            {chartData && (
              <Doughnut
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: "left"
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || ''
                          const value = context.raw as number
                          return `${label}: ${value}`
                        }
                      }
                    },
                  }
                }}
              />
            )}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-3xl font-semibold text-secondary mb-2">Ρόλος</h2>
          <h3 className="text-lg font-semibold text-secondary">Εκπαιδευτές</h3>
            <p className="text-lg font-bold text-panellinio mb-2">{trainerCount}</p>
          <h3 className="text-lg font-semibold text-secondary">Ερευνητές</h3>         
            <p className="text-lg font-bold text-panellinio mb-2">{researcherCount}</p>
          <h3 className="text-lg font-semibold text-secondary">Άλλο</h3>
            <p className="text-lg font-bold text-panellinio">{noTrReCount}</p>
          <div className="h-40 bg-gray-100 dark:bg-gray-700 rounded-md mt-2"></div>
        </div>
      </div>

      {/* Third Row */}

    </div>
  )
}
