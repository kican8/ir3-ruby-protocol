// IR3 Ruby Protocol - Dose Calculator
// Base formula: Dose (J/cm2) = Irradiance (mW/cm2) x Time (seconds) / 1000
// Inverse square for distance: Irradiance_new = Irradiance_stated x (Distance_stated / Distance_new)^2
// Session length: Time (seconds) = (Target_Dose x 1000) / Irradiance
// Cap at 20 minutes (1200 seconds). Round to nearest 30 seconds.
// Transcranial: 2.5% transmission coefficient for cortical dose estimate.

/**
 * Calculate irradiance at a new distance using inverse square law.
 * @param {number} statedIrradiance - Manufacturer-stated irradiance (mW/cm2)
 * @param {number} statedDistance - Distance at which irradiance was measured (inches)
 * @param {number} targetDistance - Desired treatment distance (inches)
 * @returns {number} Irradiance at targetDistance (mW/cm2)
 */
export function calculateIrradianceAtDistance(statedIrradiance, statedDistance, targetDistance) {
  if (targetDistance <= 0) return 0
  return statedIrradiance * Math.pow(statedDistance / targetDistance, 2)
}

/**
 * Calculate dose delivered.
 * @param {number} irradiance_mW - Irradiance in mW/cm2
 * @param {number} timeSeconds - Duration in seconds
 * @returns {number} Dose in J/cm2
 */
export function calculateDose(irradiance_mW, timeSeconds) {
  return (irradiance_mW * timeSeconds) / 1000
}

/**
 * Calculate session length to reach a target dose, rounded to nearest 30s,
 * capped at 20 minutes.
 * @param {number} targetDose - Target dose in J/cm2
 * @param {number} irradiance_mW - Irradiance in mW/cm2
 * @returns {number} Session length in seconds (rounded, capped)
 */
export function calculateSessionLength(targetDose, irradiance_mW) {
  if (irradiance_mW <= 0) return 0
  const timeSeconds = (targetDose * 1000) / irradiance_mW
  // Round to nearest 30 seconds
  const rounded = Math.round(timeSeconds / 30) * 30
  // Cap at 20 minutes
  return Math.min(rounded, 1200)
}

/**
 * Estimate cortical dose from scalp dose using 2.5% transmission.
 * @param {number} scalpDose - Dose at scalp in J/cm2
 * @returns {number} Estimated cortical dose in J/cm2
 */
export function calculateCorticalDose(scalpDose) {
  return scalpDose * 0.025
}

/**
 * Transcranial body sites (forehead / scalp regions).
 */
const TRANSCRANIAL_SITES = [
  'forehead',
  'scalp',
  'temples',
  'crown',
  'head',
  'transcranial',
]

/**
 * Given a device and session parameters, calculate everything needed
 * for a treatment session.
 *
 * @param {Object} device - Device object with statedIrradiance (mW/cm2) and statedDistance (inches)
 * @param {string} bodySite - Target body region (e.g. 'forehead', 'knee', 'neck')
 * @param {number} targetDose - Desired dose in J/cm2
 * @param {number} sessionDistance - Actual treatment distance in inches
 * @returns {Object} { irradiance, sessionLengthSeconds, estimatedDose, corticalDose, warnings }
 */
export function calculateSession(device, bodySite, targetDose, sessionDistance) {
  const warnings = []

  // 1. Calculate irradiance at the session distance using inverse square law
  const irradiance = calculateIrradianceAtDistance(
    device.statedIrradiance,
    device.statedDistance,
    sessionDistance
  )

  // 2. Calculate session length for the target dose
  const rawTimeSeconds = irradiance > 0 ? (targetDose * 1000) / irradiance : 0
  const sessionLengthSeconds = calculateSessionLength(targetDose, irradiance)

  // 3. Check for warnings
  if (sessionDistance < 12) {
    warnings.push(
      'Treatment distance is less than 12 inches. Ensure comfort and avoid excessive heat exposure.'
    )
  }

  const wasCapped = rawTimeSeconds > 1200
  if (wasCapped) {
    warnings.push(
      'Session capped at 20 minutes. Target dose may not be fully reached at this distance.'
    )
  }

  // 4. Calculate the actual estimated dose delivered within the (possibly capped) time
  const estimatedDose = calculateDose(irradiance, sessionLengthSeconds)

  // 5. If transcranial, calculate cortical dose
  const isTranscranial = TRANSCRANIAL_SITES.includes(bodySite?.toLowerCase())
  const corticalDose = isTranscranial ? calculateCorticalDose(estimatedDose) : null

  return {
    irradiance: Math.round(irradiance * 100) / 100,
    sessionLengthSeconds,
    estimatedDose: Math.round(estimatedDose * 100) / 100,
    corticalDose: corticalDose !== null ? Math.round(corticalDose * 1000) / 1000 : null,
    isTranscranial,
    warnings,
  }
}
