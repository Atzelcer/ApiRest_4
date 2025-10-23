using System;
using System.Drawing;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;

namespace ClientePersonas
{
    public partial class FormPersonaModal : Form
    {
        private readonly ApiClient apiClient;
        private readonly JObject personaData;
        private readonly bool esEdicion;

        private Label lblTitulo;
        private Label lblNombres, lblApellidos, lblCI, lblDireccion, lblTelefono, lblEmail;
        private TextBox txtNombres, txtApellidos, txtCI, txtDireccion, txtTelefono, txtEmail;
        private Button btnGuardar, btnCancelar;
        private int personaId = 0;

        public FormPersonaModal(ApiClient cliente, JObject persona)
        {
            apiClient = cliente;
            personaData = persona;
            esEdicion = persona != null;

            InitializeComponent();
            CrearControles();

            if (esEdicion)
            {
                CargarDatos();
            }
        }

        private void CrearControles()
        {
            this.Text = esEdicion ? "EDITAR PERSONA" : "CREAR PERSONA";
            this.Size = new Size(550, 550);
            this.StartPosition = FormStartPosition.CenterParent;
            this.BackColor = Color.FromArgb(236, 240, 241);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;

            lblTitulo = new Label
            {
                Text = esEdicion ? "EDITAR PERSONA" : "CREAR NUEVA PERSONA",
                Font = new Font("Segoe UI", 16, FontStyle.Bold),
                ForeColor = Color.FromArgb(44, 62, 80),
                AutoSize = true,
                Location = new Point(130, 20)
            };
            Controls.Add(lblTitulo);

            int y = 80;
            CrearCampo("NOMBRES:", ref lblNombres, ref txtNombres, 30, y, 470);

            y += 60;
            CrearCampo("APELLIDOS:", ref lblApellidos, ref txtApellidos, 30, y, 470);

            y += 60;
            CrearCampo("CI (Cédula):", ref lblCI, ref txtCI, 30, y, 470);

            y += 60;
            CrearCampo("DIRECCIÓN:", ref lblDireccion, ref txtDireccion, 30, y, 470);

            y += 60;
            CrearCampo("TELÉFONO:", ref lblTelefono, ref txtTelefono, 30, y, 220);

            y += 60;
            CrearCampo("EMAIL:", ref lblEmail, ref txtEmail, 30, y, 470);

            btnGuardar = new Button
            {
                Text = esEdicion ? "ACTUALIZAR" : "GUARDAR",
                Location = new Point(150, 460),
                Width = 120,
                Height = 40,
                BackColor = esEdicion ? Color.FromArgb(52, 152, 219) : Color.FromArgb(39, 174, 96),
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand
            };
            btnGuardar.FlatAppearance.BorderSize = 0;
            btnGuardar.Click += BtnGuardar_Click;
            Controls.Add(btnGuardar);

            btnCancelar = new Button
            {
                Text = "CANCELAR",
                Location = new Point(280, 460),
                Width = 120,
                Height = 40,
                BackColor = Color.FromArgb(149, 165, 166),
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand
            };
            btnCancelar.FlatAppearance.BorderSize = 0;
            btnCancelar.Click += BtnCancelar_Click;
            Controls.Add(btnCancelar);
        }

        private void CrearCampo(string labelText, ref Label label, ref TextBox textBox, int x, int y, int width)
        {
            label = new Label
            {
                Text = labelText,
                Location = new Point(x, y),
                ForeColor = Color.FromArgb(44, 62, 80),
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                AutoSize = true
            };
            Controls.Add(label);

            textBox = new TextBox
            {
                Location = new Point(x, y + 25),
                Width = width,
                Font = new Font("Segoe UI", 11),
                BackColor = Color.White
            };
            Controls.Add(textBox);
        }

        private void CargarDatos()
        {
            if (personaData != null)
            {
                personaId = int.Parse(personaData["id"]?.ToString() ?? "0");
                txtNombres.Text = personaData["nombres"]?.ToString() ?? "";
                txtApellidos.Text = personaData["apellidos"]?.ToString() ?? "";
                txtCI.Text = personaData["ci"]?.ToString() ?? "";
                txtDireccion.Text = personaData["direccion"]?.ToString() ?? "";
                txtTelefono.Text = personaData["telefono"]?.ToString() ?? "";
                txtEmail.Text = personaData["email"]?.ToString() ?? "";
            }
        }

        private async void BtnGuardar_Click(object sender, EventArgs e)
        {
            if (string.IsNullOrWhiteSpace(txtNombres.Text) || string.IsNullOrWhiteSpace(txtApellidos.Text))
            {
                MessageBox.Show("Los campos Nombres y Apellidos son obligatorios", "Validación", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            try
            {
                btnGuardar.Enabled = false;
                btnGuardar.Text = "GUARDANDO...";

                if (esEdicion)
                {
                    await apiClient.ActualizarPersona(
                        personaId,
                        txtNombres.Text.Trim(),
                        txtApellidos.Text.Trim(),
                        txtCI.Text.Trim(),
                        txtDireccion.Text.Trim(),
                        txtTelefono.Text.Trim(),
                        txtEmail.Text.Trim()
                    );
                    MessageBox.Show("Persona actualizada exitosamente", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }
                else
                {
                    await apiClient.CrearPersona(
                        txtNombres.Text.Trim(),
                        txtApellidos.Text.Trim(),
                        txtCI.Text.Trim(),
                        txtDireccion.Text.Trim(),
                        txtTelefono.Text.Trim(),
                        txtEmail.Text.Trim()
                    );
                    MessageBox.Show("Persona creada exitosamente", "Éxito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                }

                this.DialogResult = DialogResult.OK;
                this.Close();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al guardar: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                btnGuardar.Enabled = true;
                btnGuardar.Text = esEdicion ? "ACTUALIZAR" : "GUARDAR";
            }
        }

        private void BtnCancelar_Click(object sender, EventArgs e)
        {
            this.DialogResult = DialogResult.Cancel;
            this.Close();
        }
    }
}