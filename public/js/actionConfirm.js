
// Custom confirmation dialog logic for Delete and Update actions
// Used in show.ejs and other listing pages

function showConfirm(action, url) {
  const modal = document.getElementById('actionConfirm');
  document.getElementById('actionTitle').innerText = action === 'delete' ? 'Delete Listing' : 'Update Listing';
  document.getElementById('actionMessage').innerText = action === 'delete'
    ? 'Are you sure you want to delete this listing?'
    : 'Are you sure you want to update this listing?';
  document.getElementById('actionConfirmBtn').innerText = action === 'delete' ? 'Delete' : 'Update';
  document.getElementById('actionConfirmBtn').onclick = function() {
    if (action === 'delete') {
      // Create and submit a form for proper RESTful deletion
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      // Add hidden _method input for DELETE
      const methodInput = document.createElement('input');
      methodInput.type = 'hidden';
      methodInput.name = '_method';
      methodInput.value = 'DELETE';
      form.appendChild(methodInput);
      document.body.appendChild(form);
      form.submit();
    } else {
      // Redirect to update page
      window.location.href = url;
    }
    closeConfirm();
  };
  modal.style.display = 'block';
}

function closeConfirm() {
  document.getElementById('actionConfirm').style.display = 'none';
}

// Make functions available globally
window.showConfirm = showConfirm;
window.closeConfirm = closeConfirm;
