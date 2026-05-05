# Edit this configuration file to define what should be installed on
# your system.  Help is available in the configuration.nix(5) man page
# and in the NixOS manual (accessible by running 'nixos-help').

{ config, pkgs, unstable, ... }:

{
  imports =
    [ # Include the results of the hardware scan.
      ./hardware-configuration.nix
    ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.systemd-boot.configurationLimit = 4; # solo 4 generaciones en systemd-boot
  boot.loader.efi.canTouchEfiVariables = true;

  # Blacklist módulos inseguros del kernel
  boot.blacklistedKernelModules = [ "algif_aead" ]; # CVE-2026-31431 (Copy Fail) — kernels 4.14 a 6.19.12

  # Use latest kernel.
  # boot.kernelPackages = pkgs.linuxPackages_latest;

  networking.hostName = "mi-hostname"; # Define your hostname.
  # networking.wireless.enable = true;  # Enables wireless support via wpa_supplicant.

  # Configure network proxy if necessary
  # networking.proxy.default = "http://user:password@proxy:port/";
  # networking.proxy.noProxy = "127.0.0.1,localhost,internal.domain";

  # Enable networking
  networking.networkmanager.enable = true;

  # Set your time zone.
  time.timeZone = "UTC";

  # Select internationalisation properties.
  i18n.defaultLocale = "es_ES.UTF-8";

  i18n.supportedLocales = [ "es_ES.UTF-8/UTF-8" "en_US.UTF-8/UTF-8" ];

  i18n.extraLocaleSettings = {
    LANG = "es_ES.UTF-8";
    LC_ADDRESS = "es_ES.UTF-8";
    LC_CTYPE = "es_ES.UTF-8";
    LC_COLLATE = "es_ES.UTF-8";
    LC_IDENTIFICATION = "es_ES.UTF-8";
    LC_MEASUREMENT = "es_ES.UTF-8";
    LC_MESSAGES = "es_ES.UTF-8";
    LC_MONETARY = "es_ES.UTF-8";
    LC_NAME = "es_ES.UTF-8";
    LC_NUMERIC = "es_ES.UTF-8";
    LC_PAPER = "es_ES.UTF-8";
    LC_TELEPHONE = "es_ES.UTF-8";
    LC_TIME = "es_ES.UTF-8";
  };

  # Enable the X11 windowing system.
  # You can disable this if you're only using the Wayland session.
  services.xserver.enable = true;

  # Enable the KDE Plasma Desktop Environment.
  services.displayManager.sddm.enable = true;
  services.displayManager.sddm.autoNumlock = true; # esto es para sddm, en plasma Settings > Teclado > Bloqueo numerico al iniciar = Activado
  services.desktopManager.plasma6.enable = true;

  # Configure keymap in X11
  services.xserver.xkb = {
    layout = "es";
    variant = "";
  };

  # Configure console keymap
  console.keyMap = "es";

  # Enable CUPS to print documents.
  services.printing.enable = true;

  # Enable scanner support.
  # hardware.sane.enable = true;

  # Enable sound with pipewire.
  services.pulseaudio.enable = false;
  security.rtkit.enable = true;
  services.pipewire = {
    enable = true;
    alsa.enable = true;
    alsa.support32Bit = true;
    pulse.enable = true;
    # If you want to use JACK applications, uncomment this
    #jack.enable = true;
  };

  # Enable touchpad support (enabled default in most desktopManager).
  # services.xserver.libinput.enable = true;

  # Enable zsh as login shell
  programs.zsh.enable = true;

  # ----- Virtualización ----- #
  virtualisation.libvirtd.enable = true;
  programs.virt-manager.enable = true;
  # ---- Fin Virtualización ---- #

  # Define a user account. Don't forget to set a password with 'passwd'.
  users.users.your-user-name = {
    isNormalUser = true;
    description = "your-user-name";
    shell = pkgs.zsh;
    extraGroups = [ "networkmanager" "wheel" "libvirtd" "video" "render" ];
    packages = with pkgs; [
      kdePackages.kate
      kdePackages.filelight
      kdePackages.kcalc
      kdePackages.markdownpart # previsualización en Kate (renderizar el markdown visualmente)
      marksman                 # servidor LSP para editar markdown (autocompletado, diagnósticos, linting)
      unstable.fastfetch
      unstable.brave
      unstable.neovim
      unstable.gcc
      unstable.fd
      unstable.lazygit
      unstable.ripgrep
      unstable.git
      unstable.opencode
      unstable.antigravity
      unstable.claude-code
      unstable.discord
      unstable.telegram-desktop
      unstable.keepassxc
      unstable.easyeffects
      unstable.krita
      unstable.inkscape
      unstable.gimp
      unstable.obs-studio
      unstable.vlc
      unstable.numlockx
      unstable.anydesk
      unstable.meld
      # unstable.zoom-us
      deepfilternet
      steam-run
      direnv
    ];
  };

  # Install firefox.
  programs.firefox.enable = false;
  programs.nano.enable = false;

  # ----- Blender ----- #
  programs.nix-ld = {
    enable = true;
    libraries = with pkgs; [
      libx11
      libxext
      libxrender
      libxfixes
      libxcursor
      libxi
      libxinerama
      libglvnd
      fontconfig
      freetype
      libjpeg_turbo
      libpng
      zlib
      libxkbcommon
      libsm
      libice
      wayland
      # CUDA/OptiX para Blender:
      #linuxPackages.nvidia_x11
      config.boot.kernelPackages.nvidia_x11
      cudaPackages.cuda_cudart
    ];
  };
  # ---- Fin Blender ----#

  # Allow unfree packages
  nixpkgs.config.allowUnfree = true;

  # 64 MB = 64 (cantidad) * 1024 (bytes en 1KB) * 1024 (KB en 1MB)
  nix.settings.download-buffer-size = 64 * 1024 * 1024; # 64MB

  # Habilitar flakes (experimental)
  nix.settings.experimental-features = [ "nix-command" "flakes" ];

  # ---- NVIDIA ---- #
  # OpenGL
  hardware.graphics = {
    enable = true;
    enable32Bit = true;
  };
  # NVIDIA driver
  services.xserver.videoDrivers = [ "nvidia" ];
  hardware.nvidia = {
    modesetting.enable = true;
    open = false;
    package = config.boot.kernelPackages.nvidiaPackages.stable;
    prime = {
      # Modo sync: ambas GPUs activas siempre (máx. rendimiento en escritorio).
      # Si usas laptop y quieres ahorro de batería, cambia a:
      #   offload.enable = true;
      #   offload.enableOffloadCmd = true;
      sync.enable = true;

      intelBusId = "PCI:0:2:0";
      nvidiaBusId = "PCI:1:2:0";
    };
  };
  # ---- Fin NVIDIA ---- #

  # ---- Fuentes ---- # 
  fonts.packages = with pkgs; [
      #nerd-fonts.fira-code
      #nerd-fonts.hack
      nerd-fonts.meslo-lg
      #nerd-fonts.jetbrains-mono

      # Fuentes DejaVu (sustituto universal)
      dejavu_fonts
      
      # Fuentes Liberation (alternativas a Arial, Times New Roman, Courier)
      liberation_ttf

  ];
  # ---- Fin Fuentes ---- #

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    # vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    # wget
    pciutils # para tener lspci
    fzf      # para busquedas difusas en lazyvim
    ruff     # linter para lazyvim (para python)
    pyright  # para debugear para lazyvim (para python)
    kdePackages.kdeclarative
    kdePackages.kio
    kdePackages.kxmlgui
    kdePackages.kconfigwidgets
    kdePackages.ktexteditor
    kdePackages.plasma-workspace
    kdePackages.kcmutils
    qt6.qttranslations
    python3
  ];

  # Some programs need SUID wrappers, can be configured further or are
  # started in user sessions.
  # programs.mtr.enable = true;
  # programs.gnupg.agent = {
  #   enable = true;
  #   enableSSHSupport = true;
  # };

  # List services that you want to enable:

  # Enable the OpenSSH daemon.
  # services.openssh.enable = true;

  # Open ports in the firewall.
  # networking.firewall.allowedTCPPorts = [ ... ];
  # networking.firewall.allowedUDPPorts = [ ... ];
  # Or disable the firewall altogether.
  # networking.firewall.enable = false;

  # This value determines the NixOS release from which the default
  # settings for stateful data, like file locations and database versions
  # on your system were taken. It's perfectly fine and recommended to leave
  # this value at the release version of the first install of this system.
  # Before changing this value read the documentation for this option
  # (e.g. man configuration.nix or on https://nixos.org/nixos/options.html).
  system.stateVersion = "25.11"; # Did you read the comment?

  # ---- Mi partición Home ---- #
  fileSystems."/home" = {
    device = "/dev/disk/by-uuid/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    fsType = "ext4";
  };
  # ---- Fin Partición Home ---- #

  # ---- NAS por SMB/CIFS ---- #
  # Habilita soporte SMB en el kernel
  boot.supportedFilesystems = [ "cifs" ];

  # Montaje del NAS. Cambia IP, nombre del share y ruta de credenciales.
  fileSystems."/mnt/qnap" = {
    device = "//192.168.1.100/nas-compartido";
    fsType = "cifs";
    options = let
      creds = "/etc/nixos/.smb-creds";
    in [
      "credentials=${creds}"
      "vers=3.0"           # SMB 3 (moderno)
      "uid=1000"
      "gid=100"
      "iocharset=utf8"
      "noperm"
      "_netdev"
      "x-systemd.automount"  # montaje bajo demanda
      "noauto"
    ];
  };
  # ---- Fin NAS ---- #
}
