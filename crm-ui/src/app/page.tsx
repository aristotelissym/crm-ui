'use client'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import * as d3 from 'd3'
import { DB_Members } from '@/types'

export default function Dashboard() {
  const [totalCount, setTotalCount] = useState(0)
  const [expertiseCount, setExpertiseCount] = useState(0)
  const [publicCount, setPublicCount] = useState(0)
  const [privateCount, setPrivateCount] = useState(0)
  const [expertiseData, setExpertiseData] = useState([])
  const treemapRef = useRef(null)

  useEffect(() => {
    axios.get('http://localhost:4000/members').then((res) => {
      const data = res.data
      setTotalCount(data.length)
      setExpertiseCount(
        data.filter((member: any) => member.expertise === 'ΓενικήΟικογενειακή Ιατρική').length
      )
      setPublicCount(
        data.filter((member: any) => member.sector === 'Δημόσιος').length // Example
      )
      setPrivateCount(
        data.filter((member: any) => member.sector === 'Ιδιωτικός').length // Example
      )
      const grouped = d3.rollup(
        data,
        (v) => v.length,
        (d: any) => d.expertise
      )

      const formattedData = {
        name: 'Expertise',
        children: Array.from(grouped, ([name, value]) => ({ name, value }))
      }
      setExpertiseData(formattedData)
      
    })
  }, [])

  useEffect(() => {
    if (expertiseData.children && treemapRef.current) {
      const width = 400
      const height = 300

      const root = d3
        .hierarchy(expertiseData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value)

      d3.select(treemapRef.current).selectAll('*').remove()

      const svg = d3
        .select(treemapRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      const treemapLayout = d3.treemap().size([width, height]).padding(1)
      treemapLayout(root)

      svg
        .selectAll('rect')
        .data(root.leaves())
        .enter()
        .append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', 'steelblue')

      svg
        .selectAll('text')
        .data(root.leaves())
        .enter()
        .append('text')
        .attr('x', d => d.x0 + 4)
        .attr('y', d => d.y0 + 14)
        .text(d => d.data.name)
        .attr('font-size', '10px')
        .attr('fill', 'white')
    }
  }, [expertiseData])

  return (
    <div className="p-4 space-y-6">
      {/* First Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">Σύνολο Μελών</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{totalCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-primary">Γενική/Οικογενειακή Ιατρική</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{expertiseCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-stretch justify-items-center-safe">
          <div className='border-r border-primary mr-5 pr-5'>
          <h3 className="text-xl font-semibold text-primary">Δημόσιος Τομέας</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{publicCount}</p>
          </div>
          <div>
          <h3 className="text-xl font-semibold text-primary">Ιδιωτικός Τομέας</h3>
          <p className="text-3xl font-bold text-panellinio mt-2">{privateCount}</p>
          </div>
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
