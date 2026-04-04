import { social } from "../data/social"
import { useState } from "react"


export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)

  return (
    <div>LinkTreeView</div>
  )
}
