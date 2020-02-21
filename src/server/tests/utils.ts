export default function setIsNew(doc, val) {
  doc.isNew = val;
  doc.emit('isNew', val);
  doc.constructor.emit('isNew', val);

  const subdocs = doc.$__getAllSubdocs();
  for (const subdoc of subdocs) {
    subdoc.isNew = val;
  }
}