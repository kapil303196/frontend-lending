// Test file to verify Date of Birth validation logic
// This can be run in browser console or Node.js

function testMinAgeValidation() {
  const minAge = (age: number) => {
    return (value: string) => {
      if (!value) return { valid: true, reason: 'empty value allowed' }
      
      const birthDate = new Date(value)
      const today = new Date()
      const yearsDiff = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      const dayDiff = today.getDate() - birthDate.getDate()
      
      console.log('Birth Date:', birthDate)
      console.log('Today:', today)
      console.log('Years Diff:', yearsDiff)
      console.log('Month Diff:', monthDiff)
      console.log('Day Diff:', dayDiff)
      
      if (yearsDiff > age) return { valid: true, reason: 'years diff > age' }
      if (yearsDiff === age && monthDiff > 0) return { valid: true, reason: 'exact age, months passed' }
      if (yearsDiff === age && monthDiff === 0 && dayDiff >= 0) return { valid: true, reason: 'exact age, birthday passed' }
      
      return { valid: false, reason: 'under minimum age' }
    }
  }

  const validator = minAge(18)
  
  console.log('\n=== Test 1: Empty value ===')
  console.log(validator(''))
  
  console.log('\n=== Test 2: Person born in 2010 (under 18) ===')
  console.log(validator('2010-01-01'))
  
  console.log('\n=== Test 3: Person born in 2000 (over 18) ===')
  console.log(validator('2000-01-01'))
  
  console.log('\n=== Test 4: Person born exactly 18 years ago ===')
  const eighteenYearsAgo = new Date()
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18)
  console.log(validator(eighteenYearsAgo.toISOString().split('T')[0]))
}

testMinAgeValidation()
