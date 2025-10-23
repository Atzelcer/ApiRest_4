package ui;

import models.Persona;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class PersonaDialog extends JDialog {
    private JTextField nombresField;
    private JTextField apellidosField;
    private JTextField ciField;
    private JTextField direccionField;
    private JTextField telefonoField;
    private JTextField emailField;
    private JButton saveButton;
    private JButton cancelButton;

    private Persona persona;
    private boolean confirmado = false;

    public PersonaDialog(JFrame parent, Persona persona) {
        super(parent, persona == null ? "Crear Persona" : "Editar Persona", true);
        this.persona = persona;

        setSize(450, 400);
        setLocationRelativeTo(parent);
        setResizable(false);

        initComponents();

        if (persona != null) {
            cargarDatos();
        }
    }

    private void initComponents() {
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JPanel formPanel = new JPanel();
        formPanel.setLayout(new GridLayout(6, 2, 10, 15));

        JLabel nombresLabel = new JLabel("Nombres:");
        nombresField = new JTextField();

        JLabel apellidosLabel = new JLabel("Apellidos:");
        apellidosField = new JTextField();

        JLabel ciLabel = new JLabel("CI:");
        ciField = new JTextField();

        JLabel direccionLabel = new JLabel("Dirección:");
        direccionField = new JTextField();

        JLabel telefonoLabel = new JLabel("Teléfono:");
        telefonoField = new JTextField();

        JLabel emailLabel = new JLabel("Email:");
        emailField = new JTextField();

        formPanel.add(nombresLabel);
        formPanel.add(nombresField);
        formPanel.add(apellidosLabel);
        formPanel.add(apellidosField);
        formPanel.add(ciLabel);
        formPanel.add(ciField);
        formPanel.add(direccionLabel);
        formPanel.add(direccionField);
        formPanel.add(telefonoLabel);
        formPanel.add(telefonoField);
        formPanel.add(emailLabel);
        formPanel.add(emailField);

        mainPanel.add(formPanel, BorderLayout.CENTER);

        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new FlowLayout(FlowLayout.RIGHT));

        saveButton = new JButton("Guardar");
        saveButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                guardar();
            }
        });

        cancelButton = new JButton("Cancelar");
        cancelButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dispose();
            }
        });

        buttonPanel.add(saveButton);
        buttonPanel.add(cancelButton);

        mainPanel.add(buttonPanel, BorderLayout.SOUTH);

        add(mainPanel);
    }

    private void cargarDatos() {
        nombresField.setText(persona.getNombres());
        apellidosField.setText(persona.getApellidos());
        ciField.setText(persona.getCi());
        direccionField.setText(persona.getDireccion());
        telefonoField.setText(persona.getTelefono());
        emailField.setText(persona.getEmail());
    }

    private void guardar() {
        String nombres = nombresField.getText().trim();
        String apellidos = apellidosField.getText().trim();
        String ci = ciField.getText().trim();
        String direccion = direccionField.getText().trim();
        String telefono = telefonoField.getText().trim();
        String email = emailField.getText().trim();

        if (nombres.isEmpty() || apellidos.isEmpty() || ci.isEmpty() ||
                direccion.isEmpty() || telefono.isEmpty() || email.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Por favor complete todos los campos", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (persona == null) {
            persona = new Persona();
        }

        persona.setNombres(nombres);
        persona.setApellidos(apellidos);
        persona.setCi(ci);
        persona.setDireccion(direccion);
        persona.setTelefono(telefono);
        persona.setEmail(email);

        confirmado = true;
        dispose();
    }

    public Persona getPersona() {
        return persona;
    }

    public boolean isConfirmado() {
        return confirmado;
    }
}