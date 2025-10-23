using System;
using System.Data;
using System.Drawing;
using System.Windows.Forms;
using Newtonsoft.Json.Linq;

namespace ClientePersonas
{
    public partial class FormPrincipal : Form
    {
        private readonly ApiClient apiClient;
        private DataGridView dgvPersonas;
        private TextBox txtBuscar;
        private Button btnCrear, btnEditar, btnEliminar, btnActualizar;
        private Label lblTitulo;

        public FormPrincipal(ApiClient cliente)
        {
            apiClient = cliente;
            InitializeComponent();
            CrearControles();
            ConfigurarTabla();
            CargarPersonas();
        }

        private void CrearControles()
        {
            this.Text = "GESTION DE PERSONAS - CRUD";
            this.Size = new Size(1100, 650);
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(236, 240, 241);
            this.Font = new Font("Segoe UI", 10);

            lblTitulo = new Label
            {
                Text = "GESTION DE PERSONAS",
                Font = new Font("Segoe UI", 20, FontStyle.Bold),
                ForeColor = Color.FromArgb(44, 62, 80),
                AutoSize = true,
                Location = new Point(380, 20)
            };
            Controls.Add(lblTitulo);

            txtBuscar = new TextBox
            {
                Location = new Point(20, 80),
                Width = 500,
                Height = 35,
                Font = new Font("Segoe UI", 12),
                PlaceholderText = "Buscar por ID, nombre, apellido o CI..."
            };
            txtBuscar.TextChanged += TxtBuscar_TextChanged;
            Controls.Add(txtBuscar);

            btnCrear = CrearBoton("CREAR", 540, 80, Color.FromArgb(39, 174, 96));
            btnCrear.Click += BtnCrear_Click;

            btnEditar = CrearBoton("EDITAR", 670, 80, Color.FromArgb(52, 152, 219));
            btnEditar.Click += BtnEditar_Click;

            btnEliminar = CrearBoton("ELIMINAR", 800, 80, Color.FromArgb(231, 76, 60));
            btnEliminar.Click += BtnEliminar_Click;

            btnActualizar = CrearBoton("ACTUALIZAR", 930, 80, Color.FromArgb(241, 196, 15));
            btnActualizar.Click += BtnActualizar_Click;

            dgvPersonas = new DataGridView
            {
                Location = new Point(20, 140),
                Size = new Size(1050, 460),
                BackgroundColor = Color.White,
                ForeColor = Color.Black,
                EnableHeadersVisualStyles = false,
                ReadOnly = true,
                AllowUserToAddRows = false,
                SelectionMode = DataGridViewSelectionMode.FullRowSelect,
                AutoSizeColumnsMode = DataGridViewAutoSizeColumnsMode.Fill,
                RowHeadersVisible = false,
                Font = new Font("Segoe UI", 10),
                AutoGenerateColumns = false
            };
            dgvPersonas.ColumnHeadersDefaultCellStyle.BackColor = Color.FromArgb(52, 73, 94);
            dgvPersonas.ColumnHeadersDefaultCellStyle.ForeColor = Color.White;
            dgvPersonas.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI", 11, FontStyle.Bold);
            dgvPersonas.ColumnHeadersHeight = 40;
            dgvPersonas.AlternatingRowsDefaultCellStyle.BackColor = Color.FromArgb(236, 240, 241);
            dgvPersonas.CellDoubleClick += DgvPersonas_CellDoubleClick;
            Controls.Add(dgvPersonas);
        }

        private Button CrearBoton(string text, int x, int y, Color color)
        {
            Button btn = new Button
            {
                Text = text,
                Location = new Point(x, y),
                Width = 120,
                Height = 35,
                BackColor = color,
                ForeColor = Color.White,
                Font = new Font("Segoe UI", 10, FontStyle.Bold),
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand
            };
            btn.FlatAppearance.BorderSize = 0;
            Controls.Add(btn);
            return btn;
        }

        private void ConfigurarTabla()
        {
            dgvPersonas.Columns.Clear();
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colId",
                HeaderText = "ID",
                DataPropertyName = "Id",
                Width = 60
            });
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colNombres",
                HeaderText = "NOMBRES",
                DataPropertyName = "Nombres"
            });
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colApellidos",
                HeaderText = "APELLIDOS",
                DataPropertyName = "Apellidos"
            });
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colCi",
                HeaderText = "CI",
                DataPropertyName = "Ci",
                Width = 120
            });
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colDireccion",
                HeaderText = "DIRECCION",
                DataPropertyName = "Direccion"
            });
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colTelefono",
                HeaderText = "TELEFONO",
                DataPropertyName = "Telefono",
                Width = 120
            });
            dgvPersonas.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = "colEmail",
                HeaderText = "EMAIL",
                DataPropertyName = "Email"
            });
        }

        private async void CargarPersonas()
        {
            try
            {
                JArray personas = await apiClient.ObtenerPersonas();

                DataTable dt = new DataTable();
                dt.Columns.Add("Id", typeof(string));
                dt.Columns.Add("Nombres", typeof(string));
                dt.Columns.Add("Apellidos", typeof(string));
                dt.Columns.Add("Ci", typeof(string));
                dt.Columns.Add("Direccion", typeof(string));
                dt.Columns.Add("Telefono", typeof(string));
                dt.Columns.Add("Email", typeof(string));

                if (personas != null && personas.Count > 0)
                {
                    foreach (var p in personas)
                    {
                        dt.Rows.Add(
                            p["id"]?.ToString() ?? "",
                            p["nombres"]?.ToString() ?? "",
                            p["apellidos"]?.ToString() ?? "",
                            p["ci"]?.ToString() ?? "",
                            p["direccion"]?.ToString() ?? "",
                            p["telefono"]?.ToString() ?? "",
                            p["email"]?.ToString() ?? ""
                        );
                    }
                }

                dgvPersonas.DataSource = dt;
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error al cargar personas: {ex.Message}\n\nAsegurate que Laravel este corriendo en http://127.0.0.1:8000",
                                "Error de conexion",
                                MessageBoxButtons.OK,
                                MessageBoxIcon.Error);
            }
        }

        private void BtnCrear_Click(object sender, EventArgs e)
        {
            var modalCrear = new FormPersonaModal(apiClient, null);
            if (modalCrear.ShowDialog() == DialogResult.OK)
            {
                CargarPersonas();
            }
        }

        private void BtnEditar_Click(object sender, EventArgs e)
        {
            if (dgvPersonas.CurrentRow == null || dgvPersonas.CurrentRow.Index < 0)
            {
                MessageBox.Show("Seleccione una persona de la tabla", "Validacion", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            var personaData = ObtenerPersonaSeleccionada();
            if (personaData != null)
            {
                var modalEditar = new FormPersonaModal(apiClient, personaData);
                if (modalEditar.ShowDialog() == DialogResult.OK)
                {
                    CargarPersonas();
                }
            }
        }

        private async void BtnEliminar_Click(object sender, EventArgs e)
        {
            if (dgvPersonas.CurrentRow == null || dgvPersonas.CurrentRow.Index < 0)
            {
                MessageBox.Show("Seleccione una persona de la tabla", "Validacion", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            string id = dgvPersonas.CurrentRow.Cells["colId"].Value?.ToString();
            string nombre = dgvPersonas.CurrentRow.Cells["colNombres"].Value?.ToString();
            string apellido = dgvPersonas.CurrentRow.Cells["colApellidos"].Value?.ToString();

            var confirmResult = MessageBox.Show(
                $"Esta seguro de eliminar a {nombre} {apellido}?",
                "Confirmar eliminacion",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question
            );

            if (confirmResult == DialogResult.Yes && int.TryParse(id, out int personaId))
            {
                try
                {
                    await apiClient.EliminarPersona(personaId);
                    MessageBox.Show("Persona eliminada exitosamente", "Exito", MessageBoxButtons.OK, MessageBoxIcon.Information);
                    CargarPersonas();
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"Error al eliminar: {ex.Message}", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private void BtnActualizar_Click(object sender, EventArgs e)
        {
            CargarPersonas();
        }

        private void DgvPersonas_CellDoubleClick(object sender, DataGridViewCellEventArgs e)
        {
            if (e.RowIndex >= 0)
            {
                BtnEditar_Click(sender, e);
            }
        }

        private void TxtBuscar_TextChanged(object sender, EventArgs e)
        {
            if (dgvPersonas.DataSource == null) return;

            DataTable dt = (DataTable)dgvPersonas.DataSource;
            string filtro = txtBuscar.Text.Trim();

            if (string.IsNullOrEmpty(filtro))
            {
                dt.DefaultView.RowFilter = "";
                return;
            }

            try
            {
                dt.DefaultView.RowFilter = $"Id LIKE '%{filtro}%' OR " +
                                          $"Nombres LIKE '%{filtro}%' OR " +
                                          $"Apellidos LIKE '%{filtro}%' OR " +
                                          $"Ci LIKE '%{filtro}%'";
            }
            catch { }
        }

        private JObject ObtenerPersonaSeleccionada()
        {
            try
            {
                var row = dgvPersonas.CurrentRow;
                return new JObject
                {
                    ["id"] = row.Cells["colId"].Value?.ToString(),
                    ["nombres"] = row.Cells["colNombres"].Value?.ToString(),
                    ["apellidos"] = row.Cells["colApellidos"].Value?.ToString(),
                    ["ci"] = row.Cells["colCi"].Value?.ToString(),
                    ["direccion"] = row.Cells["colDireccion"].Value?.ToString(),
                    ["telefono"] = row.Cells["colTelefono"].Value?.ToString(),
                    ["email"] = row.Cells["colEmail"].Value?.ToString()
                };
            }
            catch
            {
                return null;
            }
        }
    }
}