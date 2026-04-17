{
  description = "Configuración NixOS de your-user-name";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";

    nixpkgs-unstable = {
      url = "github:NixOS/nixpkgs/nixos-unstable";
      flake = false;
    };
  };

  outputs = inputs @ {
    self,
    nixpkgs,
    nixpkgs-unstable,
    ...
  }: let
    inherit (nixpkgs) lib;
  in {
    nixosConfigurations."mi-hostname" = lib.nixosSystem {
      system = "x86_64-linux";

      modules = [
        ./configuration.nix
      ];

      specialArgs = {
        inherit inputs;
        unstable = import nixpkgs-unstable {
          system = "x86_64-linux";
          config.allowUnfree = true;
        };
      };
    };
  };
}
