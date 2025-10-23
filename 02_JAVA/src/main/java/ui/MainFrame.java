package ui;

import models.Persona;
import services.ApiService;
import services.AuthService;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.List;

public class MainFrame extends JFrame {
    private JTable table;
    private DefaultTableModel tableModel;
    private TableRowSorter<DefaultTableModel> sorter;
    private JTextField searchField;
    private JButton createButton;
    private JButton editButton;
    private JButton deleteButton;
    private JButton refreshButton;
    private JButton logoutButton;
    private JButton clearSearchButton;
    private List<Persona> personasOriginales;

    public MainFrame() {
        setTitle("Agenda API - Gestión de Personas");
        setSize(1100, 650);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        initComponents();
        cargarPersonas();
    }

    private void initComponents() {
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        JLabel titleLabel = new JLabel("Gestión de Personas", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Arial", Font.BOLD, 18));
        mainPanel.add(titleLabel, BorderLayout.NORTH);

        JPanel searchPanel = new JPanel();
        searchPanel.setLayout(new FlowLayout(FlowLayout.LEFT, 10, 5));
        searchPanel.setBorder(BorderFactory.createTitledBorder("Buscar"));

        JLabel searchLabel = new JLabel("Buscar:");
        searchField = new JTextField(30);
        searchField.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                filtrarTabla();
            }
        });

        clearSearchButton = new JButton("Limpiar");
        clearSearchButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                limpiarBusqueda();
            }
        });

        searchPanel.add(searchLabel);
        searchPanel.add(searchField);
        searchPanel.add(clearSearchButton);

        JPanel topPanel = new JPanel();
        topPanel.setLayout(new BorderLayout());
        topPanel.add(titleLabel, BorderLayout.NORTH);
        topPanel.add(searchPanel, BorderLayout.CENTER);

        mainPanel.add(topPanel, BorderLayout.NORTH);

        String[] columnNames = {"ID", "Nombres", "Apellidos", "CI", "Dirección", "Teléfono", "Email"};
        tableModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) {
                return false;
            }
        };

        table = new JTable(tableModel);
        table.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        table.getTableHeader().setReorderingAllowed(false);

        sorter = new TableRowSorter<>(tableModel);
        table.setRowSorter(sorter);

        table.getColumnModel().getColumn(0).setPreferredWidth(50);
        table.getColumnModel().getColumn(1).setPreferredWidth(120);
        table.getColumnModel().getColumn(2).setPreferredWidth(120);
        table.getColumnModel().getColumn(3).setPreferredWidth(100);
        table.getColumnModel().getColumn(4).setPreferredWidth(200);
        table.getColumnModel().getColumn(5).setPreferredWidth(100);
        table.getColumnModel().getColumn(6).setPreferredWidth(200);

        JScrollPane scrollPane = new JScrollPane(table);
        mainPanel.add(scrollPane, BorderLayout.CENTER);

        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new FlowLayout(FlowLayout.CENTER, 10, 10));

        createButton = new JButton("Crear");
        createButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                crearPersona();
            }
        });

        editButton = new JButton("Editar");
        editButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                editarPersona();
            }
        });

        deleteButton = new JButton("Eliminar");
        deleteButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                eliminarPersona();
            }
        });

        refreshButton = new JButton("Actualizar");
        refreshButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cargarPersonas();
            }
        });

        logoutButton = new JButton("Cerrar Sesión");
        logoutButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cerrarSesion();
            }
        });

        buttonPanel.add(createButton);
        buttonPanel.add(editButton);
        buttonPanel.add(deleteButton);
        buttonPanel.add(refreshButton);
        buttonPanel.add(logoutButton);

        mainPanel.add(buttonPanel, BorderLayout.SOUTH);

        add(mainPanel);
    }

    private void cargarPersonas() {
        try {
            personasOriginales = ApiService.obtenerPersonas();
            actualizarTabla(personasOriginales);
            limpiarBusqueda();
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error al cargar personas: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void actualizarTabla(List<Persona> personas) {
        tableModel.setRowCount(0);
        for (Persona persona : personas) {
            Object[] row = {
                    persona.getId(),
                    persona.getNombres(),
                    persona.getApellidos(),
                    persona.getCi(),
                    persona.getDireccion(),
                    persona.getTelefono(),
                    persona.getEmail()
            };
            tableModel.addRow(row);
        }
    }

    private void filtrarTabla() {
        String searchText = searchField.getText().trim().toLowerCase();

        if (searchText.isEmpty()) {
            sorter.setRowFilter(null);
        } else {
            RowFilter<DefaultTableModel, Object> rf = new RowFilter<DefaultTableModel, Object>() {
                @Override
                public boolean include(Entry<? extends DefaultTableModel, ? extends Object> entry) {
                    for (int i = 0; i < entry.getValueCount(); i++) {
                        if (entry.getStringValue(i).toLowerCase().contains(searchText)) {
                            return true;
                        }
                    }
                    return false;
                }
            };
            sorter.setRowFilter(rf);
        }
    }

    private void limpiarBusqueda() {
        searchField.setText("");
        sorter.setRowFilter(null);
    }

    private void crearPersona() {
        PersonaDialog dialog = new PersonaDialog(this, null);
        dialog.setVisible(true);

        if (dialog.isConfirmado()) {
            try {
                ApiService.crearPersona(dialog.getPersona());
                JOptionPane.showMessageDialog(this, "Persona creada exitosamente", "Éxito", JOptionPane.INFORMATION_MESSAGE);
                cargarPersonas();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error al crear persona: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void editarPersona() {
        int selectedRow = table.getSelectedRow();

        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Por favor seleccione una persona", "Advertencia", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int modelRow = table.convertRowIndexToModel(selectedRow);

        Persona persona = new Persona();
        persona.setId((Integer) tableModel.getValueAt(modelRow, 0));
        persona.setNombres((String) tableModel.getValueAt(modelRow, 1));
        persona.setApellidos((String) tableModel.getValueAt(modelRow, 2));
        persona.setCi((String) tableModel.getValueAt(modelRow, 3));
        persona.setDireccion((String) tableModel.getValueAt(modelRow, 4));
        persona.setTelefono((String) tableModel.getValueAt(modelRow, 5));
        persona.setEmail((String) tableModel.getValueAt(modelRow, 6));

        PersonaDialog dialog = new PersonaDialog(this, persona);
        dialog.setVisible(true);

        if (dialog.isConfirmado()) {
            try {
                ApiService.actualizarPersona(dialog.getPersona());
                JOptionPane.showMessageDialog(this, "Persona actualizada exitosamente", "Éxito", JOptionPane.INFORMATION_MESSAGE);
                cargarPersonas();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error al actualizar persona: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void eliminarPersona() {
        int selectedRow = table.getSelectedRow();

        if (selectedRow == -1) {
            JOptionPane.showMessageDialog(this, "Por favor seleccione una persona", "Advertencia", JOptionPane.WARNING_MESSAGE);
            return;
        }

        int modelRow = table.convertRowIndexToModel(selectedRow);

        int confirm = JOptionPane.showConfirmDialog(this, "¿Está seguro de eliminar esta persona?", "Confirmar", JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            try {
                Integer id = (Integer) tableModel.getValueAt(modelRow, 0);
                ApiService.eliminarPersona(id);
                JOptionPane.showMessageDialog(this, "Persona eliminada exitosamente", "Éxito", JOptionPane.INFORMATION_MESSAGE);
                cargarPersonas();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error al eliminar persona: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void cerrarSesion() {
        int confirm = JOptionPane.showConfirmDialog(this, "¿Está seguro de cerrar sesión?", "Confirmar", JOptionPane.YES_NO_OPTION);

        if (confirm == JOptionPane.YES_OPTION) {
            AuthService.logout();
            LoginFrame loginFrame = new LoginFrame();
            loginFrame.setVisible(true);
            this.dispose();
        }
    }
}