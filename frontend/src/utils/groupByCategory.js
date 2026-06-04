export default function groupByCategory(interests)  {
  return interests.reduce((grouped, interest) => {
    const category = interest.category
    if(!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(interest)
    return grouped
  }, {})
}