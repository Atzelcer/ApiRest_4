using System;
using System.Drawing;
using System.Windows.Forms;

namespace ClientePersonas
{
    public partial class FormLogin : Form
    {
        private ApiClient apiClient;
        private Label lblTitulo;
        private Label lblEmail;
        private Label lblPassword;
        private TextBox txtEmail;
        private TextBox txtPassword;
        private Button btnLogin;
        private Label lblMensaje;

        public FormLogin()
        {
            apiClient = new ApiClient();
            InitializeComponent();
            CrearControles();
        }

        private void CrearControles()
        {
            this.Text = "LOGIN - SISTEMA DE PERSONAS";
            this.StartPosition = FormStartPosition.CenterScreen;
            this.Size = new Size(450, 350);
            this.BackColor = Color.FromArgb(44, 62, 80);
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;

            lblTitulo = new Label
            {
                Text = "INICIAR SESION",
                Font = new Font("Segoe UI", 18, FontStyle.Bold),
                ForeColor = Color.White,
                AutoSize = true,
                Location = new Point(100, 30)
            };

            lblEmail = new Label
            {
                Text = "EMAIL:",
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(50, 100),
                AutoSize = true
            };

            txtEmail = new TextBox
            {
                Location = new Point(50, 130),
                Width = 330,
                Font = new Font("Segoe UI", 11),
                Text = "admin@admin.com"
            };

            lblPassword = new Label
            {
                Text = "PASSWORD:",
                Font = new Font("Segoe UI", 11, FontStyle.Bold),
                ForeColor = Color.White,
                Location = new Point(50, 170),
                AutoSize = true
            };

            txtPassword = new TextBox
            {
                Location = new Point(50, 200),
                Width = 330,
                Font = new Font("Segoe UI", 11),
                UseSystemPasswordChar = true,
                Text = "admin123"
            };

            btnLogin = new Button
            {
                Text = "INGRESAR",
                Location = new Point(130, 250),
                Width = 170,
                Height = 40,
                Font = new Font("Segoe UI", 12, FontStyle.Bold),
                BackColor = Color.FromArgb(39, 174, 96),
                ForeColor = Color.White,
                FlatStyle = FlatStyle.Flat,
                Cursor = Cursors.Hand
            };
            btnLogin.FlatAppearance.BorderSize = 0;
            btnLogin.Click += BtnLogin_Click;

            lblMensaje = new Label
            {
                Text = "",
                Location = new Point(50, 300),
                Width = 330,
                Height = 20,
                ForeColor = Color.FromArgb(231, 76, 60),
                Font = new Font("Segoe UI", 9, FontStyle.Bold),
                TextAlign = ContentAlignment.MiddleCenter
            };

            this.Controls.Add(lblTitulo);
            this.Controls.Add(lblEmail);
            this.Controls.Add(txtEmail);
            this.Controls.Add(lblPassword);
            this.Controls.Add(txtPassword);
            this.Controls.Add(btnLogin);
            this.Controls.Add(lblMensaje);
        }

        private async void BtnLogin_Click(object sender, EventArgs e)
        {
            lblMensaje.Text = "Conectando...";
            lblMensaje.ForeColor = Color.FromArgb(241, 196, 15);

            string email = txtEmail.Text.Trim();
            string password = txtPassword.Text.Trim();

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            {
                lblMensaje.Text = "Complete todos los campos";
                lblMensaje.ForeColor = Color.FromArgb(231, 76, 60);
                return;
            }

            try
            {
                var respuesta = await apiClient.Login(email, password);

                if (respuesta["status"]?.ToString() == "success")
                {
                    lblMensaje.Text = "Login exitoso";
                    lblMensaje.ForeColor = Color.FromArgb(39, 174, 96);

                    FormPrincipal principal = new FormPrincipal(apiClient);
                    this.Hide();
                    principal.ShowDialog();
                    this.Close();
                }
                else
                {
                    string mensaje = respuesta["message"]?.ToString() ?? "Credenciales incorrectas";
                    lblMensaje.Text = mensaje;
                    lblMensaje.ForeColor = Color.FromArgb(231, 76, 60);
                }
            }
            catch (Exception ex)
            {
                lblMensaje.Text = $"Error: {ex.Message}";
                lblMensaje.ForeColor = Color.FromArgb(231, 76, 60);
            }
        }
    }
}