export default function getStatusColor(status) {
  if (status === 'open') {
    return 'badge border-green-400 text-green-300 uppercase text-xl';
  }
  return 'badge border-red-400 text-red-300 uppercase text-xl';
}