"use client"
import React from 'react'
import Link from 'next/link'
function LinkComponent({to,children}) {
  return (
    <Link href={to}>
      {children}
    </Link>
  )
}

export default LinkComponent
